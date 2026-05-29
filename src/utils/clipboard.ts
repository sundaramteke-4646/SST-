/**
 * A highly resilient clipboard copy helper designed with custom fallbacks for iOS Safari,
 * iPads, embedded WebViews, and operations within restricted iframe contexts.
 */
export function copyToClipboard(text: string): boolean {
  // 1. Try modern Clipboard API
  if (navigator.clipboard) {
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Modern clipboard API failed/blocked, applying iOS fallback...", err);
    }
  }

  // 2. Legacy / iOS / IFrame Textarea Fallback
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Prevent styling side effects or auto-scrolling
  textArea.style.position = 'fixed';
  textArea.style.top = '0px';
  textArea.style.left = '0px';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.style.fontSize = '16px'; // Crucial: Prevents iOS autofocus zoom-in behavior
  textArea.setAttribute('readonly', ''); // Prevent keyboard popup
  
  document.body.appendChild(textArea);
  
  // Selection logic optimized for iOS
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 999999);
  
  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
    console.error('iOS custom clipboard selection copy failed:', err);
  }
  
  document.body.removeChild(textArea);
  return successful;
}
