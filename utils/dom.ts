// @ts-nocheck

export function copyToClipboard(text, callback) {
  const tag = document.createElement('input')
  tag.setAttribute('id', 'copy-to-clip-input000')
  tag.value = text
  document.getElementsByTagName('body')[0].appendChild(tag)
  document.getElementById('copy-to-clip-input000').select()
  document.execCommand('copy')
  document.getElementById('copy-to-clip-input000').remove()
  if (callback) {
    callback(text)
  }
}
