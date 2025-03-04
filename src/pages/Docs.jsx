import { useEffect, useState, useRef, useMemo } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'
import { getDocumentsByCustId } from '../crm context/CrmAction'
import { faChessKing } from '@fortawesome/free-regular-svg-icons'

const Docs = () => {
  const { claims } = useAuthStatusTwo()

  const cachedClaims = useMemo(() => {
    // Only memoize when claims are available
    if (!claims) return null

    return claims
  }, [claims])
  //

  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadedFileURL, setUploadedFileURL] = useState(null)
  const { uid } = useParams()
  useEffect(() => {
    window.scrollTo({
      top: 0,
    })

    const getDocData = async () => {
      if (!uid) return
      const data = await getDocumentsByCustId(uid)
      console.log(data)
    }

    getDocData()
    return () => {}
  }, [uid])

  const handleButtonClick = () => {
    // Trigger the file input click
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Reset states when a new file is selected
      setUploadProgress(0)
      setUploadError(null)
      setUploadedFileURL(null)
    }
  }

  const uploadFileToFirebase = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const storage = getStorage()

      // Create a unique file path using timestamp and original filename
      const timestamp = new Date().getTime()
      const fileExtension = selectedFile.name.split('.').pop()
      const fileName = `${timestamp}-${selectedFile.name}`

      // Create storage reference
      const storageRef = ref(storage, `documents/${fileName}`)

      // Start upload task
      const uploadTask = uploadBytesResumable(storageRef, selectedFile)

      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          // Handle errors
          console.error('Upload failed:', error)
          setUploadError('Upload failed: ' + error.message)
          setIsUploading(false)
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setUploadedFileURL(downloadURL)
          setIsUploading(false)

          // Store metadata in Firestore
          await saveDocumentMetadata(downloadURL, selectedFile.name, fileExtension)
        }
      )
    } catch (error) {
      console.error('Error starting upload:', error)
      setUploadError('Error starting upload: ' + error.message)
      setIsUploading(false)
    }
  }

  const saveDocumentMetadata = async (url, fileName, fileType) => {
    try {
      const db = getFirestore()
      await addDoc(collection(db, 'documents'), {
        name: fileName,
        type: fileType,
        url: url,
        uploadedAt: new Date(),
        size: selectedFile.size,
        custId: uid,
        accessLevel: cachedClaims?.claims?.roleLevel,
        pdfImg:
          'https://firebasestorage.googleapis.com/v0/b/crm---v1.appspot.com/o/misc%2Fsmall-pdf.png?alt=media&token=8fe91137-6c1c-4c37-8171-34fb868eb41e',
      })
      console.log('Document metadata saved to Firestore')
    } catch (error) {
      console.error('Error saving metadata:', error)
      setUploadError('File uploaded but metadata could not be saved.')
    }
  }

  return (
    <div className="page-contaimer docs-page-grid">
      <div className="docs-page-grid-item">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="file-input-hidden"
          accept=".pdf,.doc,.docx"
        />
        <button onClick={handleButtonClick} className="upload-button">
          <span className="button-icon">+</span>
          Upload Document
        </button>

        {selectedFile && (
          <div className="selected-file">
            Selected: {selectedFile.name}
            <div className="file-actions">
              <button
                onClick={uploadFileToFirebase}
                disabled={isUploading}
                className="upload-action-button"
              >
                {isUploading ? 'Uploading...' : 'Upload to Firebase'}
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(uploadProgress)}% Uploaded</div>
          </div>
        )}

        {uploadError && <div className="upload-error">Error: {uploadError}</div>}

        {uploadedFileURL && (
          <div className="upload-success">
            Upload successful!
            <a
              href={uploadedFileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="file-link"
            >
              View Document
            </a>
          </div>
        )}
      </div>
      <div className="docs-page-grid-item">
        {/* ... */}
      </div>
    </div>
  )
}

export default Docs
