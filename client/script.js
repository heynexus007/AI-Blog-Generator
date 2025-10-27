// DOM elements
const blogForm = document.getElementById('blogForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const resultSection = document.getElementById('result');
const blogContent = document.getElementById('blogContent');
const errorSection = document.getElementById('error');
const errorText = document.getElementById('errorText');
const copyBtn = document.getElementById('copyBtn');
const newPostBtn = document.getElementById('newPostBtn');
const resultKeywords = document.getElementById('resultKeywords');
const resultTone = document.getElementById('resultTone');
const resultLength = document.getElementById('resultLength');

// Form submission handler
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(blogForm);
    const keywords = formData.get('keywords').trim();
    const tone = formData.get('tone');
    const length = formData.get('length');
    
    // Client-side validation
    if (!keywords || !tone || !length) {
        showError('Please fill in all required fields.');
        return;
    }
    
    if (keywords.length < 2) {
        showError('Keywords must be at least 2 characters long.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    hideError();
    hideResult();
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords,
                tone,
                length
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }
        
        if (data.success && data.content) {
            displayResult(data.content, data.metadata);
        } else {
            throw new Error('Invalid response format from server');
        }
        
    } catch (error) {
        console.error('Error generating blog:', error);
        showError(`Failed to generate blog: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
});

// Copy to clipboard functionality
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(blogContent.textContent);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Failed to copy text:', error);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = blogContent.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            copyBtn.textContent = '✅ Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy to Clipboard';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (fallbackError) {
            showError('Failed to copy text to clipboard');
        }
        
        document.body.removeChild(textArea);
    }
});

// Generate new post functionality
newPostBtn.addEventListener('click', () => {
    hideResult();
    hideError();
    blogForm.reset();
    document.getElementById('keywords').focus();
});

// Utility functions
function setLoadingState(isLoading) {
    generateBtn.disabled = isLoading;
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

function displayResult(content, metadata) {
    blogContent.textContent = content;
    
    // Update metadata display
    if (metadata) {
        resultKeywords.textContent = `Keywords: ${metadata.keywords}`;
        resultTone.textContent = `Tone: ${capitalizeFirst(metadata.tone)}`;
        resultLength.textContent = `Length: ${capitalizeFirst(metadata.length)}`;
    }
    
    resultSection.style.display = 'block';
    
    // Smooth scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

function showError(message) {
    errorText.textContent = message;
    errorSection.style.display = 'block';
    
    // Scroll to error
    setTimeout(() => {
        errorSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

function hideError() {
    errorSection.style.display = 'none';
}

function hideResult() {
    resultSection.style.display = 'none';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Form validation enhancements
document.getElementById('keywords').addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length > 0 && value.length < 2) {
        e.target.setCustomValidity('Keywords must be at least 2 characters long');
    } else {
        e.target.setCustomValidity('');
    }
});

// Auto-focus on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('keywords').focus();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!generateBtn.disabled) {
            blogForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        if (resultSection.style.display === 'block') {
            newPostBtn.click();
        }
    }
});