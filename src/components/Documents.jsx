export default function Documents (){
    return(
        <div   style={{
    border: '2px dashed black',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer'
  }}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    const file = files[0]
    const reader = new FileReader()
reader.onload = async (e) => {
  const formData = new FormData()
  formData.append("file", file)
  // εδώ έχεις το text του αρχείου

  try {
    const response = await fetch("http://localhost:3000/api/ingest", {
      method: "POST",
      body: formData
    })
  } catch (error) {
    console.log("something went wrong")
    }

}
reader.readAsText(file)
  }}
>
  Drag files here
</div>
    )
}