export const getReleaseDate = (dates) => {
  // Assuming you have the HTML content stored in a variable, for example:
  const htmlContent = `
Chapter 25 
UP 

Chapter 24 
Oct 26, 23 

Chapter 23 
Oct 21, 23 

Chapter 22 
Oct 21, 23 

Chapter 21 
Oct 21, 23 

Chapter 20 
Oct 21, 23 

Chapter 19 
Oct 21, 23 

Chapter 18 
Oct 21, 23 

Chapter 17 
Oct 21, 23 

Chapter 16 
Oct 21, 23 

Chapter 15 
Oct 21, 23 

Chapter 14 
Oct 21, 23 

Chapter 13 
Oct 21, 23 

Chapter 12 
Oct 21, 23 

Chapter 11 
Oct 21, 23 

Chapter 10 
Oct 21, 23 

Chapter 9 
Oct 21, 23 

Chapter 8 
Oct 21, 23 

Chapter 7 
Oct 21, 23 

Chapter 6 
Oct 21, 23 

Chapter 5 
Oct 21, 23 

Chapter 4 
Oct 21, 23 

Chapter 3 
Oct 21, 23 

Chapter 2 
Oct 21, 23 

Chapter 1 
Oct 21, 23 
`

  // Split the content into lines
  const lines = htmlContent.split('\n')

  // Initialize variables to store the chapter and release date
  let chapter1Text = null
  let releaseDate = null
  console.log('chapter1Text', chapter1Text)

  // Iterate through the lines to find "Chapter 1" and its release date
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === 'Chapter 1') {
      chapter1Text = line
      // The next line contains the release date, assuming it's in the format "Oct 21, 23"
      releaseDate = lines[i + 2].trim()
      break
    }
  }

  // Check if "Chapter 1" was found and display it along with the release date
  if (chapter1Text) {
    console.log('chapter1Text', chapter1Text)
    console.log('Release Date:', releaseDate)
    return releaseDate
  } else {
    console.log('Chapter 1 not found.')
  }
}
