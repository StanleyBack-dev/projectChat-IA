// homeScript.js

// Função para enviar a mensagem para a API e receber a resposta
export const sendChatMessage = async (message) => {
    try {
        // Exibe o indicador de carregamento
        document.getElementById('loading').style.display = 'flex';

        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.response || 'Sem resposta';

        // Adiciona a resposta da IA ao chat com formatação
        addMessageToChat('Chat IA', formatText(reply));

    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
        addMessageToChat('Erro', 'Não foi possível enviar a mensagem.');
    } finally {
        // Oculta o indicador de carregamento
        document.getElementById('loading').style.display = 'none';
    }
};

// Função para adicionar uma mensagem ao chat
const addMessageToChat = (sender, message, isUser = false) => {
    const messagesDiv = document.getElementById('messages');
    const messageClass = isUser ? 'user' : 'ai';
    messagesDiv.innerHTML += `
        <div class="message-container ${messageClass}">
            <p class="sender-name">${sender}:</p>
            <div class="message">${message}</div>
        </div>
    `;
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Rola para baixo automaticamente
    updateScrollDownButtonVisibility();
};

// Função para formatar o texto com quebras de linha e blocos de código
const formatText = (text) => {
    // Substitui quebras de linha por <br>
    let formattedText = text.replace(/\n/g, '<br>');

    // Substitui blocos de código por elementos <pre><code>
    formattedText = formattedText.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
    });

    return formattedText;
};

// Função para escapar caracteres HTML
const escapeHtml = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Adiciona o listener de evento ao botão de envio
document.getElementById('sendButton').addEventListener('click', () => {
    const input = document.getElementById('input');
    const message = input.value.trim();

    if (message) {
        // Adiciona a mensagem do usuário ao chat
        addMessageToChat('Você', formatText(message), true);

        // Envia a mensagem para a API
        sendChatMessage(message);

        // Limpa o campo de entrada
        input.value = '';
    }
});

// Adiciona o listener de evento ao campo de entrada para envio com Enter
document.getElementById('input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('sendButton').click();
    }
});

// Adiciona o listener de evento ao botão de reload para limpar o chat
document.getElementById('reloadButton').addEventListener('click', () => {
    document.getElementById('messages').innerHTML = ''; // Limpa o chat
    updateScrollDownButtonVisibility(); // Atualiza visibilidade após limpar
});

// Função para rolar para baixo
document.getElementById('scrollDownButton').addEventListener('click', () => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Função para atualizar a visibilidade do botão de rolar para baixo
const updateScrollDownButtonVisibility = () => {
    const messagesDiv = document.getElementById('messages');
    const scrollHeight = messagesDiv.scrollHeight; // Altura total do conteúdo
    const clientHeight = messagesDiv.clientHeight; // Altura visível do container
    const scrollTop = messagesDiv.scrollTop; // Posição do scroll

    const scrollDownButton = document.getElementById('scrollDownButton');
    
    // Verifica se há mais conteúdo para rolar e se o scroll não está no final
    if (scrollHeight > clientHeight && (scrollTop + clientHeight) < scrollHeight - 5) {
        scrollDownButton.style.display = 'flex'; // Exibe o botão
    } else {
        scrollDownButton.style.display = 'none'; // Oculta o botão
    }
};

// Adiciona um listener de evento de scroll para atualizar a visibilidade do botão
document.getElementById('messages').addEventListener('scroll', updateScrollDownButtonVisibility);

// Inicializa a visibilidade do botão ao carregar a página
updateScrollDownButtonVisibility();

