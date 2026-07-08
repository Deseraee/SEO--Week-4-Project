import { useState } from 'react'

function Scan() {
  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="upload-zone">
      <label className="upload-box">
        <svg className="leaf-icon" viewBox = "0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  )
}

export default Scan