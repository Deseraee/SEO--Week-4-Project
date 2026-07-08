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