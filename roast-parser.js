// Roast Parser - Converts Roast.md to JavaScript data structure
// This script extracts roasts and meme links from the markdown file

async function parseRoastFile() {
    const response = await fetch('Roast.md');
    const text = await response.text();
    const lines = text.split('\n');
    
    const roasts = {
        english: [],
        hinglish: [],
        memes: []
    };
    
    let currentSection = null;
    let inMemesSection = false;
    
    for (let line of lines) {
        const trimmed = line.trim();
        
        // Detect section headers
        if (trimmed.toLowerCase().includes('english roast')) {
            currentSection = 'english';
            inMemesSection = false;
            continue;
        }
        
        if (trimmed.toLowerCase().includes('hinglish roast')) {
            currentSection = 'hinglish';
            inMemesSection = false;
            continue;
        }
        
        if (trimmed.toLowerCase().includes('memes link')) {
            inMemesSection = true;
            currentSection = null;
            continue;
        }
        
        // Extract roast lines (non-empty, not headers, not markdown formatting)
        if (currentSection && trimmed.length > 0) {
            // Skip markdown headers and separators
            if (!trimmed.startsWith('#') && 
                !trimmed.startsWith('---') && 
                !trimmed.startsWith('##') &&
                trimmed.length > 10) { // Reasonable minimum length
                roasts[currentSection].push(trimmed);
            }
        }
        
        // Extract meme URLs
        if (inMemesSection && trimmed.startsWith('http')) {
            roasts.memes.push(trimmed);
        }
    }
    
    console.log(`Parsed ${roasts.english.length} English roasts`);
    console.log(`Parsed ${roasts.hinglish.length} Hinglish roasts`);
    console.log(`Parsed ${roasts.memes.length} meme links`);
    
    return roasts;
}

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseRoastFile };
}
