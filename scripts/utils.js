function renderAttachmentsPreview(attachmentsList, previewElementId) {
    const preview = document.getElementById(previewElementId);
    preview.innerHTML = '';

    if (!attachmentsList) {
        return;
    }

    attachmentsList.forEach(function(attachmentData, index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('attachment-item');

        if (attachmentData.data.startsWith("data:image")) {
            const img = document.createElement('img');
            img.src = attachmentData.data;
            wrapper.appendChild(img);
        } else {
            const link = document.createElement('a');
            link.href = attachmentData.data;
            const linkIcon = document.createElement('span');
            linkIcon.classList.add('download-icon');
            const downloadIcon = document.createElement('i');
            downloadIcon.classList.add('fa-solid', 'fa-download');
            linkIcon.appendChild(downloadIcon);
            link.appendChild(linkIcon);
            const linkText = document.createElement('span');
            linkText.textContent = attachmentData.name;
            link.appendChild(linkText);
            link.setAttribute('download', attachmentData.name);
            wrapper.appendChild(link);
        }

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('remove-attachment-btn');
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-xmark');
        removeBtn.appendChild(removeIcon);

        removeBtn.addEventListener('click', function() {
            attachmentsList.splice(index, 1);
            renderAttachmentsPreview(attachmentsList, previewElementId);
        });

        wrapper.appendChild(removeBtn);
        preview.appendChild(wrapper);
    });
}