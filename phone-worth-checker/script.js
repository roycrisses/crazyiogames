let phoneData = null;
let searchInput = null;
let searchResults = null;
let selectedPhone = null;
let uploadedImages = {};
let hfClient = null;
let aiAnalysisComplete = false;

// Load phone data
async function loadPhoneData() {
    try {
        const response = await fetch('phones.json');
        phoneData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading phone data:', error);
    }
}

// Initialize application
function initializeApp() {
    initializeHuggingFace();
    initializeSearch();
    initializeImageUploads();
    initializeCalculateButton();
}

// Initialize Hugging Face client
function initializeHuggingFace() {
    // Wait for HfInference to be loaded
    const checkHfInterval = setInterval(() => {
        if (window.HfInference && typeof CONFIG !== 'undefined') {
            hfClient = new window.HfInference(CONFIG.HUGGINGFACE_API_TOKEN);
            console.log('Hugging Face AI initialized');
            clearInterval(checkHfInterval);
        }
    }, 100);
}

// Initialize search functionality
function initializeSearch() {
    searchInput = document.getElementById('phone-search');
    searchResults = document.getElementById('search-results');
    
    // Search input event
    searchInput.addEventListener('input', handleSearch);
    
    // Click outside to close results
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
    
    // Focus to show all results
    searchInput.addEventListener('focus', function() {
        if (searchInput.value.trim() === '') {
            showAllPhones();
        } else {
            handleSearch();
        }
    });
}

// Handle search input
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === '') {
        showAllPhones();
        return;
    }
    
    const filtered = phoneData.phones.filter(phone => {
        return phone.name.toLowerCase().includes(query) ||
               phone.brand.toLowerCase().includes(query);
    });
    
    displaySearchResults(filtered);
}

// Show all phones
function showAllPhones() {
    displaySearchResults(phoneData.phones);
}

// Display search results
function displaySearchResults(phones) {
    searchResults.innerHTML = '';
    
    if (phones.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No phones found. Try a different search term.</div>';
        searchResults.classList.remove('hidden');
        return;
    }
    
    phones.forEach(phone => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <span class="phone-brand">${phone.brand}</span>
            ${phone.name}
        `;
        item.addEventListener('click', function() {
            selectPhone(phone);
        });
        searchResults.appendChild(item);
    });
    
    searchResults.classList.remove('hidden');
}

// Hide search results
function hideSearchResults() {
    searchResults.classList.add('hidden');
}

// Select a phone (Step 1)
function selectPhone(phone) {
    selectedPhone = phone;
    searchInput.value = phone.name;
    hideSearchResults();
    
    // Show selected phone
    const selectedDisplay = document.getElementById('selected-phone-display');
    const selectedName = document.getElementById('selected-phone-name');
    selectedName.textContent = phone.name;
    selectedDisplay.classList.remove('hidden');
    
    // Show Step 2: Specifications
    document.getElementById('specifications-section').classList.remove('hidden');
    
    // Show Step 3: Image upload
    document.getElementById('image-upload-section').classList.remove('hidden');
    
    // Hide result section until calculation
    document.getElementById('result-section').classList.add('hidden');
    
    // Scroll to specifications
    setTimeout(() => {
        document.getElementById('specifications-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Initialize image upload functionality
function initializeImageUploads() {
    const imageInputs = ['front', 'back', 'top', 'bottom', 'left', 'right'];
    
    imageInputs.forEach(position => {
        const input = document.getElementById(`img-${position}`);
        const preview = document.getElementById(`preview-${position}`);
        
        // Click preview to trigger file input
        preview.addEventListener('click', () => input.click());
        
        // Handle file selection
        input.addEventListener('change', function(e) {
            handleImageUpload(e, position, preview);
        });
    });
}

// Handle image upload and preview
async function handleImageUpload(event, position, previewElement) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            // Store image data
            uploadedImages[position] = e.target.result;
            
            // Update preview
            previewElement.innerHTML = `<img src="${e.target.result}" alt="${position} view">`;
            
            // Analyze first uploaded image (front view is most important)
            if (position === 'front' && hfClient && !aiAnalysisComplete) {
                await analyzeImageCondition(file);
            }
        };
        
        reader.readAsDataURL(file);
    }
}

// Analyze image condition using AI
async function analyzeImageCondition(imageFile) {
    const analysisResult = document.getElementById('ai-analysis-result');
    const analysisText = document.getElementById('ai-analysis-text');
    
    // Show loading state
    analysisResult.classList.remove('hidden');
    analysisText.textContent = 'AI is analyzing your phone condition...';
    
    try {
        // Use image classification to detect phone condition
        const result = await hfClient.imageClassification({
            data: imageFile,
            model: 'google/vit-base-patch16-224'
        });
        
        // Interpret results to suggest condition
        const topResult = result[0];
        const confidence = (topResult.score * 100).toFixed(1);
        
        // Analyze keywords in classification
        const label = topResult.label.toLowerCase();
        let suggestedCondition = 'excellent';
        let conditionText = '';
        
        // Simple heuristic based on classification confidence and labels
        if (label.includes('damaged') || label.includes('broken') || label.includes('crack')) {
            suggestedCondition = 'poor';
            conditionText = 'AI detected possible damage. Suggested condition: Poor';
        } else if (label.includes('scratch') || label.includes('worn')) {
            suggestedCondition = 'fair';
            conditionText = 'AI detected visible wear. Suggested condition: Fair';
        } else if (label.includes('used') || confidence < 70) {
            suggestedCondition = 'good';
            conditionText = 'AI detected moderate wear. Suggested condition: Good';
        } else if (confidence >= 70 && confidence < 85) {
            suggestedCondition = 'excellent';
            conditionText = 'AI detected minimal wear. Suggested condition: Excellent';
        } else {
            suggestedCondition = 'mint';
            conditionText = 'AI detected pristine condition. Suggested condition: Mint';
        }
        
        // Auto-select suggested condition
        document.getElementById('condition-select').value = suggestedCondition;
        
        analysisText.textContent = `${conditionText} (${confidence}% confidence). Classification: ${topResult.label}`;
        aiAnalysisComplete = true;
        
    } catch (error) {
        console.error('AI Analysis error:', error);
        analysisText.textContent = 'AI analysis unavailable. Please manually select condition above.';
    }
}

// Initialize calculate button
function initializeCalculateButton() {
    const calculateBtn = document.getElementById('calculate-btn');
    
    calculateBtn.addEventListener('click', function() {
        if (validateForm()) {
            calculatePhoneValue();
        }
    });
}

// Validate form before calculation
function validateForm() {
    if (!selectedPhone) {
        alert('Please select a phone model first.');
        return false;
    }
    
    const storage = document.getElementById('storage-select').value;
    const condition = document.getElementById('condition-select').value;
    
    if (!storage) {
        alert('Please select storage capacity.');
        return false;
    }
    
    if (!condition) {
        alert('Please select phone condition.');
        return false;
    }
    
    return true;
}

// Calculate phone value based on specifications
function calculatePhoneValue() {
    const basePrice = selectedPhone.price;
    const storage = parseInt(document.getElementById('storage-select').value);
    const ram = document.getElementById('ram-select').value;
    const condition = document.getElementById('condition-select').value;
    
    // Storage adjustment
    let storageAdjustment = 0;
    if (storage === 64) storageAdjustment = -50;
    else if (storage === 128) storageAdjustment = 0;
    else if (storage === 256) storageAdjustment = 50;
    else if (storage === 512) storageAdjustment = 100;
    else if (storage === 1024) storageAdjustment = 150;
    
    // Condition multiplier
    let conditionMultiplier = 1.0;
    let conditionAdjustment = 0;
    
    if (condition === 'mint') conditionMultiplier = 1.15;
    else if (condition === 'excellent') conditionMultiplier = 1.0;
    else if (condition === 'good') conditionMultiplier = 0.85;
    else if (condition === 'fair') conditionMultiplier = 0.65;
    else if (condition === 'poor') conditionMultiplier = 0.45;
    
    // Calculate final price
    const priceWithStorage = basePrice + storageAdjustment;
    conditionAdjustment = Math.round((priceWithStorage * conditionMultiplier) - priceWithStorage);
    const finalPrice = Math.round(priceWithStorage * conditionMultiplier);
    
    // Display results
    displayResults(finalPrice, basePrice, storageAdjustment, conditionAdjustment, storage, ram, condition);
}

// Display calculation results
function displayResults(finalPrice, basePrice, storageAdj, conditionAdj, storage, ram, condition) {
    // Update prices
    document.getElementById('price-value').textContent = `$${finalPrice}`;
    document.getElementById('base-price').textContent = `$${basePrice}`;
    document.getElementById('storage-adjustment').textContent = `${storageAdj >= 0 ? '+' : ''}$${storageAdj}`;
    document.getElementById('condition-adjustment').textContent = `${conditionAdj >= 0 ? '+' : ''}$${conditionAdj}`;
    
    // Update trend
    document.getElementById('trend-indicator').textContent = selectedPhone.trend;
    
    // Update spec summary
    const conditionText = document.getElementById('condition-select').options[document.getElementById('condition-select').selectedIndex].text;
    const specSummary = `${selectedPhone.name} • ${storage}GB${ram ? ' • ' + ram + 'GB RAM' : ''} • ${conditionText.split(' - ')[0]}`;
    document.getElementById('spec-summary').textContent = specSummary;
    
    // Update last updated date
    document.getElementById('last-updated').textContent = formatDate(phoneData.lastUpdated);
    
    // Update affiliate links
    updateAffiliateLinks(selectedPhone);
    
    // Show result section
    const resultSection = document.getElementById('result-section');
    resultSection.classList.remove('hidden');
    
    // Scroll to results
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update affiliate links
function updateAffiliateLinks(phone) {
    // eBay link
    const ebayLink = document.getElementById('ebay-link');
    ebayLink.href = `https://www.ebay.com/sch/i.html?_nkw=${phone.ebayQuery}`;
    
    // Swappa link
    const swappaLink = document.getElementById('swappa-link');
    swappaLink.href = `https://swappa.com/mobile/${phone.swappaQuery}`;
    
    // Amazon Renewed link
    const amazonLink = document.getElementById('amazon-link');
    amazonLink.href = `https://www.amazon.com/s?k=${phone.amazonQuery}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadPhoneData);
