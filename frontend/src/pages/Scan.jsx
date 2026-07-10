import { useState } from 'react'

function Scan({ username }) {
  const [image, setImage] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('Image selected:', file.name)
      setImage(URL.createObjectURL(file))

      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height 
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const pngBase64 = canvas.toDataURL('image/png').split(',')[1]
          console.log('Image converted to PNG base64, length:', pngBase64.length)
          handleScan(pngBase64)
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async (base64Image) => {
    setLoading(true)
    setError(null)
    setScanResult(null)

    try {
      console.log('Sending image to backend...')
      console.log('Saving scan for username:', username)
      
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          username: username,
        }),
      })

      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        setScanResult(data)
      } else {
        setError(data.error || 'Failed to scan image')
      }
    } catch (err) {
      console.error('Error scanning image:', err)
      setError('Could not connect to server. Make sure Flask is running on port 5001.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="scan-page">

      <p className="scan-subtitle">Upload a photo to identify it</p>

      <div className="upload-zone">
        <label className="upload-box">
          <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20c8-1 14-6 15-15-9 0-14 5-15 14-1 3 0 1 0 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M6 18C10 14 13 10 17 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/> 
          </svg>
          <span className="upload-text">Upload here</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            hidden
          />
        </label>

        {image && (
          <div className="preview">
            <p>Preview:</p>
            <img src={image} alt="Scanned preview" width="220" />
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <p>Analyzing with Claude AI...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {scanResult && !loading && (
        <div className="results-section">
          <h2>Results</h2>
          <div className="result-card">
            <div><strong>Common Name:</strong> {scanResult.common_name || 'N/A'}</div>
            <div><strong>Scientific Name:</strong> {scanResult.scientific_name || 'N/A'}</div>
            <div><strong>Description:</strong> {scanResult.description || 'N/A'}</div>
            <div><strong>Origin:</strong> {scanResult.origin || 'N/A'}</div>
            <div><strong>Safety:</strong> {scanResult.safety_precautions || 'N/A'}</div>
            <div><strong>Fun Fact:</strong> {scanResult.fun_fact || 'N/A'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scan