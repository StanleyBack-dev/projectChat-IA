// FUNCTION TO SEND MESSAGE TO THE API AND RECEIVE THE RESPONSE
export const sendChatMessage = async (message) => {
    try {
        // DISPLAY LOADING INDICATOR
        document.getElementById('loading').style.display = 'flex';

        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ERROR! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.response || 'No response';

        // ADD AI RESPONSE TO CHAT WITH FORMATTING
        addMessageToChat('Chat AI', formatText(reply));

    } catch (error) {
        console.error('Error sending the message:', error);
        // ADD ERROR MESSAGE TO CHAT
        addMessageToChat('Error', 'Could not send the message.');
    } finally {
        // HIDE LOADING INDICATOR
        document.getElementById('loading').style.display = 'none';
    }
};

// FUNCTION TO ADD A MESSAGE TO THE CHAT
const addMessageToChat = (sender, message, isUser = false) => {
    const messagesDiv = document.getElementById('messages');
    const messageClass = isUser ? 'user' : 'ai';
    messagesDiv.innerHTML += `
        <div class="message-container ${messageClass}">
            <p class="sender-name">${sender}:</p>
            <div class="message">${message}</div>
        </div>
    `;
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // AUTOMATICALLY SCROLL TO BOTTOM
    updateScrollDownButtonVisibility();
};

// FUNCTION TO FORMAT TEXT WITH LINE BREAKS AND CODE BLOCKS
const formatText = (text) => {
    // REPLACE LINE BREAKS WITH <br>
    let formattedText = text.replace(/\n/g, '<br>');

    // REPLACE CODE BLOCKS WITH <pre><code> ELEMENTS
    formattedText = formattedText.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
    });

    return formattedText;
};

// FUNCTION TO ESCAPE HTML CHARACTERS
const escapeHtml = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// ADD EVENT LISTENER TO SEND BUTTON
document.getElementById('sendButton').addEventListener('click', () => {
    const input = document.getElementById('input');
    const message = input.value.trim();

    if (message) {
        // ADD USER MESSAGE TO CHAT
        addMessageToChat('You', formatText(message), true);

        // SEND MESSAGE TO API
        sendChatMessage(message);

        // CLEAR INPUT FIELD
        input.value = '';
    }
});

// ADD EVENT LISTENER TO INPUT FIELD FOR ENTER KEY
document.getElementById('input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('sendButton').click();
    }
});

// ADD EVENT LISTENER TO RELOAD BUTTON TO CLEAR CHAT
document.getElementById('reloadButton').addEventListener('click', () => {
    document.getElementById('messages').innerHTML = ''; // CLEAR CHAT
    updateScrollDownButtonVisibility(); // UPDATE VISIBILITY AFTER CLEARING
});

// FUNCTION TO SCROLL TO BOTTOM
document.getElementById('scrollDownButton').addEventListener('click', () => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// FUNCTION TO UPDATE SCROLL DOWN BUTTON VISIBILITY
const updateScrollDownButtonVisibility = () => {
    const messagesDiv = document.getElementById('messages');
    const scrollHeight = messagesDiv.scrollHeight; // TOTAL CONTENT HEIGHT
    const clientHeight = messagesDiv.clientHeight; // VISIBLE HEIGHT OF THE CONTAINER
    const scrollTop = messagesDiv.scrollTop; // CURRENT SCROLL POSITION

    const scrollDownButton = document.getElementById('scrollDownButton');
    
    // CHECK IF THERE IS MORE CONTENT TO SCROLL AND IF SCROLL IS NOT AT THE BOTTOM
    if (scrollHeight > clientHeight && (scrollTop + clientHeight) < scrollHeight - 5) {
        scrollDownButton.style.display = 'flex'; // SHOW BUTTON
    } else {
        scrollDownButton.style.display = 'none'; // HIDE BUTTON
    }
};

// ADD SCROLL EVENT LISTENER TO UPDATE SCROLL DOWN BUTTON VISIBILITY
document.getElementById('messages').addEventListener('scroll', updateScrollDownButtonVisibility);

// INITIALIZE SCROLL DOWN BUTTON VISIBILITY ON PAGE LOAD
updateScrollDownButtonVisibility();