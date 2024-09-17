// Sample petition data
const petitions = [
    {
        id: 1,
        name: "End the Immoral Practice of GoGuardian and Other Monitoring Devices on Students",
        description: "Schools are infringing on students' privacy by unjustifiably controlling their software. This approach undermines students' right to privacy and reflects a lack of trust between students and educators. We believe that students deserve to have their privacy respected and to be trusted to use educational tools responsibly.",
        signatures: [],
        image: "privacy.jpg"
    },


];

// Function to create petition cards
function createPetitionCards() {
    const petitionGrid = document.querySelector('.petition-grid');
    petitions.forEach(petition => {
        const card = document.createElement('div');
        card.className = 'petition-card';
        card.innerHTML = `
            <img src="${petition.image}" alt="${petition.name}">
            <div class="petition-card-content">
                <h3>${petition.name}</h3>
                <p>${petition.description}</p>
                <p>Signatures: <span class="signature-count" data-id="${petition.id}">${petition.signatures.length}</span></p>
                <button class="sign-button" data-id="${petition.id}">Sign Petition</button>
            </div>
        `;
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('sign-button')) {
                showSignatureList(petition.id);
            }
        });
        petitionGrid.appendChild(card);
    });
}

// Function to open petition popup
function openPetitionPopup(petitionId) {
    const petition = petitions.find(p => p.id === petitionId);
    const popup = document.getElementById('petition-popup');
    const petitionName = document.getElementById('petition-name');
    
    petitionName.textContent = petition.name;
    popup.style.display = 'block';
    popup.dataset.petitionId = petitionId;
}

// Function to close petition popup
function closePetitionPopup() {
    const popup = document.getElementById('petition-popup');
    popup.style.display = 'none';
    popup.dataset.petitionId = '';
}

// Function to update signature count in UI
function updateSignatureCount(petitionId, newCount) {
    const signatureElement = document.querySelector(`.signature-count[data-id="${petitionId}"]`);
    if (signatureElement) {
        signatureElement.textContent = newCount;
    }
}

// Function to sign petition
function signPetition() {
    const popup = document.getElementById('petition-popup');
    const petitionId = parseInt(popup.dataset.petitionId);
    const petition = petitions.find(p => p.id === petitionId);
    const signerName = document.getElementById('signer-name').value || 'Anonymous';
    
    if (petition) {
        const signatureIndex = petition.signatures.length + 1;
        petition.signatures.push({ name: signerName, index: signatureIndex });
        updateSignatureCount(petitionId, petition.signatures.length);
        
        // Save signatures to localStorage
        localStorage.setItem('petitionSignatures', JSON.stringify(petitions));
        
        // Close popup and reset name field
        closePetitionPopup();
        document.getElementById('signer-name').value = '';
        
        console.log(`Petition "${petition.name}" signed by ${signerName} as the ${signatureIndex}${getOrdinalSuffix(signatureIndex)} person`);
    } else {
        console.error('Petition not found');
    }
}

// Function to show signature list
function showSignatureList(petitionId) {
    const petition = petitions.find(p => p.id === petitionId);
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <section id="signature-list">
            <div class="container">
                <h2>${petition.name}</h2>
                <p>${petition.description}</p>
                <h3>Signatures</h3>
                <ul class="signature-list">
                    ${petition.signatures.map(signature => 
                        `<li>
                            <span class="signer-name">${signature.name}</span>
                            <span class="signature-index">${signature.index}${getOrdinalSuffix(signature.index)}</span>
                         </li>`
                    ).join('')}
                </ul>
                <button id="back-to-petitions">Back to Petitions</button>
            </div>
        </section>
    `;
    document.getElementById('back-to-petitions').addEventListener('click', () => {
        location.reload();
    });
}

// Helper function to get ordinal suffix
function getOrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load saved signatures from localStorage
    const savedSignatures = localStorage.getItem('petitionSignatures');
    if (savedSignatures) {
        const parsedSignatures = JSON.parse(savedSignatures);
        petitions.forEach((petition, index) => {
            petition.signatures = parsedSignatures[index].signatures;
        });
    }

    createPetitionCards();
    
    // Sign petition buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sign-button')) {
            const petitionId = parseInt(e.target.getAttribute('data-id'));
            openPetitionPopup(petitionId);
        }
    });
    
    // Close popup button
    document.getElementById('close-popup').addEventListener('click', closePetitionPopup);
    
    // Sign petition in popup
    document.getElementById('sign-petition').addEventListener('click', signPetition);
    
    // Contact form submission (for demonstration, just prevents default action)
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message. We will get back to you soon!');
        e.target.reset();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Optional: Add a scroll event listener to change header style on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.boxShadow = 'none';
    }
});