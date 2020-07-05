const editTemplate = document.createElement('template')
editTemplate.innerHTML = `
  <form method="post">
    <textarea></textarea>
    <br>
    <button>Edit</button>
    <button id="cancel">Cancel</button>
  </form>
`

const snippets = document.querySelectorAll('.snippet')
for (const snippet of snippets) {
  snippet.addEventListener('click', e => {
    if (e.target.nodeName === 'I') {
      const content = snippet.querySelector('.snippetContent')
      content.remove()

      snippet.appendChild(editTemplate.cloneNode(true).content)
      const form = snippet.parentElement.querySelector('form')
      form.action = '/editSnippet/' + snippet._id
      console.log(content.textContent.trim())
      form.querySelector('textarea').innerText = content.textContent.trim()
      form.querySelector('textarea').focus()

      form.querySelector('#cancel').addEventListener('click', e => {
        e.preventDefault()
        snippet.appendChild(content)
        form.remove()
      })
    }
  })
}

export function editSnippet (id) {
  console.log('editing ', this)
}
