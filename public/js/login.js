const db = firebase.firestore();

function reactiveLoginModal(themeStream = currentTheme) {
  const loginStream = new Stream(null); // emits user or error or null (cancel)
  const emailStream = new Stream('');
  const passwordStream = new Stream('');

  // Modal container
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.zIndex = '9999';

  // Modal content box
  const content = document.createElement('div');
  content.style.padding = '2rem';
  content.style.borderRadius = '8px';
  content.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  content.style.minWidth = '300px';
  content.style.backgroundColor = themeStream.get().colors.surface || '#fff';
  content.style.color = themeStream.get().colors.foreground || '#000';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '1rem';

  const title = document.createElement('h2');
  title.textContent = 'Log in to Flow Control Center';
  title.style.margin = '0';
  content.appendChild(title);

  content.appendChild(editText(emailStream, {
    placeholder: 'Email',
    width: '100%',
    padding: '0.5rem'
  }, themeStream));

  const passwordInput = editText(passwordStream, {
    placeholder: 'Password',
    width: '100%',
    padding: '0.5rem'
  }, themeStream);
  passwordInput.type = 'password';
  content.appendChild(passwordInput);

  // Buttons
  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'space-between';
  btnRow.style.gap = '1rem';

  const loginBtn = reactiveButton(new Stream("Login"), async () => {
    const email = emailStream.get();
    const password = passwordStream.get();

    if (!email || !password) {
      loginStream.set(new Error("Email and password are required."));
      return;
    }

    try {
      const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
      loginStream.set(userCred.user);
      modal.remove();
    } catch (err) {
      loginStream.set(new Error(err.message));
    }
  }, { accent: true }, themeStream);
    const signupBtn = reactiveButton(new Stream("Subscribe"), async () => {
    const email = emailStream.get();
    const password = passwordStream.get();

    if (!email || !password) {
        loginStream.set(new Error("Email and password are required."));
        return;
    }

    try {
        const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // Optional: Add user to Firestore (if you're using Firestore)
        const db = firebase.firestore?.();
        if (db) {
          await db.collection('users').doc(userCred.user.uid).set({
              email: userCred.user.email,
              uid: userCred.user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }

        loginStream.set(userCred.user);
        modal.remove();
    } catch (err) {
        loginStream.set(new Error(err.message));
    }
    }, { outline: true }, themeStream);

  const cancelBtn = reactiveButton(new Stream("Cancel"), () => {
    loginStream.set(null);
    modal.remove();
  }, { outline: true }, themeStream);

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(signupBtn);
  btnRow.appendChild(loginBtn);
  content.appendChild(btnRow);

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      loginStream.set(null);
      modal.remove();
    }
  });

  return loginStream;
}



function openDiagramPickerModal(currentUser, themeStream = currentTheme) {
  const pickStream = new Stream(null); // emits selected diagram or null

  // Modal base
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.zIndex = '9999';

  // Content box
  const content = document.createElement('div');
  content.style.padding = '2rem';
  content.style.borderRadius = '8px';
  content.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  content.style.minWidth = '400px';
  content.style.maxHeight = '80vh';
  content.style.overflowY = 'auto';
  content.style.backgroundColor = themeStream.get().colors.surface || '#fff';
  content.style.color = themeStream.get().colors.foreground || '#000';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '1rem';

  const title = document.createElement('h2');
  title.textContent = 'Select a Diagram';
  content.appendChild(title);

  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '0.5rem';
  content.appendChild(list);

  // Load diagrams from Firestore
  
  db.collection('users')
  .doc(currentUser.uid)
  .get()
  .then(doc => {
    const userData = doc.data();
    const index = userData.diagrams || [];

    if (index.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = "No saved diagrams.";
      list.appendChild(empty);
    } else {
      index.sort((a, b) => b.lastUpdated - a.lastUpdated); // newest first

      index.forEach(entry => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '0.5rem 1rem';
        item.style.border = '1px solid #ccc';
        item.style.borderRadius = '4px';
        item.style.backgroundColor = '#f9f9f9';
        item.style.cursor = 'pointer';
        item.style.gap = '1rem';

        const name = entry.name || `Untitled (${entry.id})`;
        const notes = entry.notes || '';
        console.log("194", notes);

        // Text container (left side)
        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';
        textContainer.style.display = 'flex';
        textContainer.style.flexDirection = 'column';

        const nameEl = document.createElement('div');
        nameEl.textContent = name;
        nameEl.style.fontWeight = 'bold';

        const notesEl = document.createElement('div');
        notesEl.textContent = notes;
        notesEl.style.fontSize = '0.9rem';
        notesEl.style.color = themeStream.get().colors.foreground + 'aa';

        textContainer.appendChild(nameEl);
        textContainer.appendChild(notesEl);

        // Delete button (right side)
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete Diagram';
        deleteBtn.style.border = 'none';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '1.2rem';
        deleteBtn.style.color = '#b00';

        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // prevent item click
          const confirmed = await showConfirmationDialog(`Are you sure you want to delete "${entry.name}"?`, themeStream);
            if (!confirmed) return;

            try {
                const userRef = db.collection('users').doc(currentUser.uid);
                const diagramRef = userRef.collection('diagrams').doc(entry.id);

                await diagramRef.delete();

                await userRef.update({
                diagrams: firebase.firestore.FieldValue.arrayRemove(entry)
                });

                showToast(`🗑️ Diagram "${entry.name}" deleted.`, { type: 'warning' });

                item.remove();
            } catch (err) {
                showToast(`❌ Failed to delete diagram: ${err.message}`, { type: 'error' });
            }
        });

        // Click on main item to load
        item.addEventListener('click', async () => {
          const doc = await db.collection('users')
            .doc(currentUser.uid)
            .collection('diagrams')
            .doc(entry.id)
            .get();

          notesStream.set(entry.notes);

          pickStream.set({ id: entry.id, data: doc.data() });
          modal.remove();
        });

        item.addEventListener('mouseenter', () => item.style.backgroundColor = '#eee');
        item.addEventListener('mouseleave', () => item.style.backgroundColor = '#f9f9f9');

        item.appendChild(textContainer);
        item.appendChild(deleteBtn);
        list.appendChild(item);
      });
    }
  })
  .catch(err => {
    const error = document.createElement('p');
    error.textContent = "❌ Failed to load diagram index: " + err.message;
    error.style.color = 'red';
    list.appendChild(error);
  });


  // Footer buttons
  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'space-between';
  btnRow.style.gap = '1rem';

  const newBtn = reactiveButton(new Stream("🆕 New Diagram"), () => {
    pickStream.set({ new: true });
    modal.remove();
  }, { accent: true }, themeStream);

  const cancelBtn = reactiveButton(new Stream("Cancel"), () => {
    pickStream.set(null);
    modal.remove();
  }, { outline: true }, themeStream);

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(newBtn);
  content.appendChild(btnRow);

  modal.appendChild(content);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      pickStream.set(null);
      modal.remove();
    }
  });

  return pickStream;
}


function promptDiagramMetadata(initialName = '', initialNotes = '', themeStream = currentTheme) {
  const resultStream = new Stream(null);
  const theme = themeStream.get();
  const colors = theme.colors;

  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999'
  });

  const box = document.createElement('div');
  Object.assign(box.style, {
    backgroundColor: colors.surface,
    color: colors.foreground,
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: '360px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    fontFamily: theme.fonts?.base || 'system-ui, sans-serif'
  });

  const title = document.createElement('h2');
  title.textContent = 'Save Diagram';
  title.style.margin = '0';
  title.style.fontSize = '1.25rem';
  title.style.color = colors.accent;
  box.appendChild(title);

  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Diagram Name';
  nameInput.value = initialName;
  Object.assign(nameInput.style, {
    padding: '0.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    backgroundColor: colors.primary,
    color: colors.foreground,
    fontSize: '1rem'
  });

  const notesInput = document.createElement('textarea');
  notesInput.placeholder = 'Notes (optional)';
  notesInput.value = initialNotes;
  notesInput.rows = 4;
  Object.assign(notesInput.style, {
    padding: '0.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    backgroundColor: colors.primary,
    color: colors.foreground,
    fontSize: '1rem'
  });

  const btnRow = document.createElement('div');
  Object.assign(btnRow.style, {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '0.5rem'
  });

  function styledButton(label, onClick, isAccent = false) {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      flex: 1,
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
      backgroundColor: isAccent ? colors.accent : colors.border,
      color: colors.background,
      transition: 'background-color 0.2s ease'
    });
    btn.onmouseenter = () => btn.style.backgroundColor = isAccent ? colors.foreground : '#999';
    btn.onmouseleave = () => btn.style.backgroundColor = isAccent ? colors.accent : colors.border;
    btn.onclick = onClick;
    return btn;
  }

  const cancelBtn = styledButton('Cancel', () => {
    resultStream.set(null);
    modal.remove();
  });

  const saveBtn = styledButton('Save', () => {
    resultStream.set({
      name: nameInput.value.trim(),
      notes: notesInput.value.trim()
    });
    modal.remove();
  }, true);

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(saveBtn);
  box.appendChild(nameInput);
  box.appendChild(notesInput);
  box.appendChild(btnRow);
  modal.appendChild(box);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      resultStream.set(null);
      modal.remove();
    }
  });

  return resultStream;
}


function selectVersionModal(diagramName, versions, themeStream = currentTheme) {
  const versionStream = new Stream("0"); // Default to latest
  const pickStream = new Stream(null);   // Emits selected version index

  // Choices for dropdown
  const versionChoices = versions.map((ver, index) => ({
    value: index.toString(),
    label: `Version ${index + 1} — ${new Date(ver.timestamp).toLocaleString()}`
  }));

  const dropdown = dropdownStream(versionStream, {
    choices: versionChoices,
    width: '100%',
    margin: '0.5rem 0'
  }, themeStream);

  const confirmBtn = reactiveButton(new Stream("📥 Load Selected Version"), () => {
    pickStream.set(parseInt(versionStream.get(), 10));
    modal.remove();
  }, { accent: true }, themeStream);

  // Modal shell
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999'
  });

  const box = document.createElement('div');
  Object.assign(box.style, {
    backgroundColor: themeStream.get().colors.surface,
    color: themeStream.get().colors.foreground,
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: '360px',
    fontFamily: themeStream.get().fonts?.base || 'system-ui, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  });

  const label = document.createElement('label');
  label.textContent = `Choose version for "${diagramName}"`;
  label.style.fontWeight = 'bold';
  box.appendChild(label);

  box.appendChild(dropdown);
  box.appendChild(confirmBtn);
  modal.appendChild(box);
  document.body.appendChild(modal);

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      pickStream.set(null);
      modal.remove();
    }
  });

  return pickStream; // Emits index of selected version
}


function handleAttachmentSelection(attachmentId, versionIndex) {
  // Fetch the attachment from Firestore
  db.collection('users')
    .doc(currentUser.uid)
    .collection('attachments')
    .doc(attachmentId)
    .get()
    .then(doc => {
      const attachmentData = doc.data();
      
      // Ensure the attachment exists and has versions
      if (!attachmentData || !attachmentData.versions || attachmentData.versions.length <= versionIndex) {
        showToast("Attachment or version not found.", { type: 'error' });
        return;
      }

      // Get the selected version's metadata
      const selectedVersion = attachmentData.versions[versionIndex];

      // Prepare the metadata to copy to the diagram element
      const attachmentMetadata = {
        attachmentId: doc.id, // Reference to the attachment document
        version: selectedVersion.version,
        name: selectedVersion.name || attachmentData.name,
        description: selectedVersion.description,
        type: selectedVersion.type,
        urls: selectedVersion.urls,
        lastUpdated: attachmentData.lastUpdated
      };

      // Get current diagram data
      const currentDiagramData = diagramDataStream.get();
      if (!currentDiagramData) {
        showToast("No diagram data available to save.", { type: 'error' });
        return;
      }

      // Example: Add attachment to a specific diagram element (replace `elementId` with actual id)
      const elementId = 'StartEvent_1'; // Replace with actual element ID
      const updatedElementMetadata = {
        ...currentDiagramData[elementId],
        attachments: [
          ...(currentDiagramData[elementId].attachments || []), // Ensure we keep existing attachments
          attachmentMetadata
        ]
      };

      // Update the diagram data with the new attachment metadata
      diagramDataStream.set({
        ...currentDiagramData,
        [elementId]: updatedElementMetadata,
      });

      showToast("Attachment successfully added to diagram element.", { type: 'success' });
    })
    .catch(err => {
      console.error("Error fetching attachment:", err);
      showToast("Failed to fetch attachment.", { type: 'error' });
    });
}

function typeChoices(type, ) {
  var choices = [];
  if (type === 'Knowledge') {
      choices = [
        { label: 'Process Assumptions', value: 'Process Assumptions' },
        { label: 'Process Issues', value: 'Process Issues' },
        { label: 'Lessons Learned', value: 'Lessons Learned' },
        { label: 'Best Practices', value: 'Best Practices' },
        { label: 'Practical Solutions', value: 'Practical Solutions' },
        { label: 'Other', value: 'Other' }
      ];
    } else if (type === 'Business') {
      choices = [
        { label: 'Corporate Mission', value: 'Corporate Mission' },
        { label: 'Critical Success', value: 'Critical Success' },
        { label: 'Goals', value: 'Goals' },
        { label: 'Objectives', value: 'Objectives' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Tool') {
      choices = [
        { label: 'Hardware', value: 'Hardware' },
        { label: 'Software', value: 'Software' },
        { label: 'Techno-mechanical', value: 'Techno-mechanical' },        
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Equipment') {
      choices = [
        { label: 'Apparatus', value: 'Apparatus' },
        { label: 'Fixed', value: 'Fixed' },
        { label: 'Asset', value: 'Asset' },        
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'System') {
      choices = [
        { label: 'Transaction Processing', value: 'Transaction Processing' },
        { label: 'Office Automation', value: 'Office Automation' },
        { label: 'Knowledge Work', value: 'Knowledge Work' },        
        { label: 'Management Information', value: 'Management Information' },
        { label: 'Decision Support', value: 'Decision Support' },
        { label: 'Executive Support', value: 'Executive Support' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Lifecycle') {
      choices = [
        { label: 'Create', value: 'Create' },
        { label: 'In Work', value: 'In Work' },
        { label: 'In Review', value: 'In Review' },        
        { label: 'Approved', value: 'Approved' },
        { label: 'Released', value: 'Released' },
        { label: 'Archived', value: 'Archived' },
        { label: 'Obsolete', value: 'Obsolete' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Requirement') {
      choices = [
        { label: 'Availability', value: 'Availability' },
        { label: 'Resource', value: 'Resource' },
        { label: 'Customer', value: 'Customer' },        
        { label: 'Directive', value: 'Directive' },
        { label: 'Governance', value: 'Governance' },
        { label: 'Quality (e.g., ISO)', value: 'Quality (e.g., ISO)' },
        { label: 'Legal', value: 'Legal' },
        { label: 'Maintainability', value: 'Maintainability' },
        { label: 'Policy', value: 'Policy' },
        { label: 'Procedure(s)', value: 'Procedure(s)' },
        { label: 'Work Instruction', value: 'Work Instruction' },
        { label: 'Regulations', value: 'Regulations' },
        { label: 'Reliability', value: 'Reliability' },
        { label: 'Safety', value: 'Safety' },
        { label: 'Service Responsibility', value: 'Service Responsibility' },
        { label: 'Standards', value: 'Standards' },
        { label: 'System', value: 'System' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Measurement') {
      choices = [
        { label: 'Quality', value: 'Quality' },
        { label: 'Quantity', value: 'Quantity' },
        { label: 'Time', value: 'Time' },        
        { label: 'Cost', value: 'Cost' },
        { label: 'Service Level Agreement', value: 'Service Level Agreement' },
        { label: 'Utilization', value: 'Utilization' },       
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Condition') {
      choices = [
        { label: 'Start Event', value: 'Start Event' },
        { label: 'Stop Event', value: 'Stop Event' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Material') {
      choices = [
        { label: 'Raw', value: 'Raw' },
        { label: 'Processed', value: 'Processed' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Role') {
      choices = [
        { label: 'Individual', value: 'Individual' },
        { label: 'Group', value: 'Group' },
        { label: 'Organization', value: 'Organization' },
        { label: 'Stakeholders', value: 'Stakeholders' },
        { label: 'Others', value: 'Others' }
      ];
    } else if (type === 'Information') {
      choices = [
        { label: 'Artifact', value: 'Artifact' },
        { label: 'Data', value: 'Data' },
        { label: 'Others', value: 'Others' }
      ];
    } 

    return choices;

}

function openAddOnModal(currentUser, mode = 'add', addOnData = null, themeStream = currentTheme) {
  const modalStream = new Stream(null);  // Will emit the created or edited AddOn
  
  // ——— Backdrop ———
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 9999
  });

  // ——— Content Box ———
  const content = document.createElement('div');
  Object.assign(content.style, {
    padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    minWidth: '320px', maxHeight: '90vh', overflowY: 'auto',
    backgroundColor: themeStream.get().colors.surface || '#fff',
    color: themeStream.get().colors.foreground || '#000',
    display: 'flex', flexDirection: 'column', gap: '1rem'
  });
  modal.appendChild(content);

  // ——— Title ———
  const title = document.createElement('h2');
  title.textContent = mode === 'add' ? 'Add New AddOn' : 'Edit AddOn';
  content.appendChild(title);

  // ——— Type Dropdown ———
  const typeStream = new Stream(addOnData?.type || '');
  const typeDropdown = dropdownStream(typeStream, {
    choices: [
      { label: '📚 Knowledge', value: 'Knowledge' },
      { label: '💼 Business', value: 'Business' },
      { label: '📝 Requirement', value: 'Requirement' },
      { label: '🔄 Lifecycle', value: 'Lifecycle' },
      { label: '📊 Measurement', value: 'Measurement' },
      { label: '⚖️ Condition', value: 'Condition' },
      { label: '🧱 Material', value: 'Material' },
      { label: '👤 Role', value: 'Role' },
      { label: '🛠️ Equipment', value: 'Equipment' },
      { label: '⚙️ System', value: 'System' },
      { label: '🧰 Tool', value: 'Tool' },
      { label: 'ℹ️ Information', value: 'Information' }
    ],
    width: '100%',
    margin: '0.5rem 0'
  }, themeStream);
  content.appendChild(column([ typeDropdown ], { width: '100%' }, themeStream));

  // ——— Subtype Dropdown ———
  const subtypeStream = new Stream(addOnData?.subtype || '');
  const subtypeChoicesStream = new Stream([]);

  function renderSubtype(choices, preselect) {
    subtypeContainer.innerHTML = '';
    if (preselect && choices.find(c => c.value === preselect)) {
      subtypeStream.set(preselect);
    } else {
      subtypeStream.set(choices[0]?.value || '');
    }
    const dd = dropdownStream(subtypeStream, {
      choices,
      width: '100%',
      margin: '0.5rem 0'
    }, themeStream);
    subtypeContainer.appendChild(column([ dd ], { width: '100%' }, themeStream));
  }

  // initial empty
  const subtypeContainer = document.createElement('div');
  content.appendChild(subtypeContainer);
  renderSubtype([], mode === 'edit' ? addOnData.subtype : null);

  // ——— Update subtypes on type change ———
  typeStream.subscribe(type => {
    let choices = typeChoices(type);

    
    subtypeChoicesStream.set(choices);
    renderSubtype(choices, mode === 'edit' ? addOnData.subtype : null);
  });

  // ——— Name Input ———
  const nameStream = new Stream(addOnData?.name || '');
  const nameInput = editText(nameStream, {
    placeholder: 'Name of AddOn',
    width: '100%', padding: '0.5rem'
  }, themeStream);
  content.appendChild(column([ nameInput ], { width: '100%' }, themeStream));

  // ——— Notes ———
  const notesStream = new Stream(addOnData?.notes || '');
  const notesInput = document.createElement('textarea');
  Object.assign(notesInput.style, {
    padding: '0.5rem', width: '100%', height: '100px',
    borderRadius: '6px', border: `1px solid ${themeStream.get().colors.border}`,
    backgroundColor: themeStream.get().colors.primary,
    color: themeStream.get().colors.foreground,
    fontSize: '1rem', marginBottom: '0.5rem'
  });
  notesInput.placeholder = 'Add Notes';
  notesInput.value = notesStream.get();
  notesInput.addEventListener('input', () => notesStream.set(notesInput.value));
  content.appendChild(column([ notesInput ], { width: '100%' }, themeStream));

  // ——— URL ———
  const urlStream = new Stream(addOnData?.url || '');
  const urlInput = editText(urlStream, {
    placeholder: 'URL (optional)', width: '100%', padding: '0.5rem'
  }, themeStream);
  content.appendChild(column([ urlInput ], { width: '100%' }, themeStream));

  // ——— Save Button ———
  const btnRow = row([], { justify: 'space-between', gap: '1rem' }, themeStream);
  const cancelBtn = reactiveButton(new Stream('Cancel'), () => {
    modalStream.set(null);
    modal.remove();
  }, { outline: true }, themeStream);

  const saveBtn = reactiveButton(new Stream(mode === 'add' ? 'Add AddOn' : 'Save Changes'), async () => {
    const newAddOn = {
      type: typeStream.get(),
      subtype: subtypeStream.get(),
      name: nameStream.get(),
      notes: notesStream.get(),
      url: urlStream.get(),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };

    const userRef = db.collection('users').doc(currentUser.uid);
    try {
      if (mode === 'add') {
        const version = {
          name: newAddOn.name,
          notes: newAddOn.notes,
          url: newAddOn.url,
          type: newAddOn.type,
          subtype: newAddOn.subtype,
          timestamp: new Date().toISOString()
        };
        const ref = await userRef
          .collection('addOns')
          .add({
            versions: [version],
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
          });

        await userRef.update({
          addOns: firebase.firestore.FieldValue.arrayUnion({
            address: ref.id,
            type: newAddOn.type,
            name: newAddOn.name,
            notes: newAddOn.notes,
            url: newAddOn.url,
            subtype: newAddOn.subtype
          })
        });

        modalStream.set(version);
        showToast("AddOn added!", { type: 'success' });
      } else {
        const version = {
          name: newAddOn.name,
          notes: newAddOn.notes,
          url: newAddOn.url,
          type: newAddOn.type,
          subtype: newAddOn.subtype,
          timestamp: new Date().toISOString()
        };

        // 1) add version to the subcollection
        await userRef
          .collection('addOns')
          .doc(addOnData.id)
          .update({
            versions: firebase.firestore.FieldValue.arrayUnion(version),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
          });

        // 2) REMOVE the old index entry
        await userRef.update({
          addOns: firebase.firestore.FieldValue.arrayRemove({
            address: addOnData.id,
            type: addOnData.type,
            name: addOnData.name,
            notes: addOnData.notes,
            url: addOnData.url,
            subtype: addOnData.subtype
          })
        });

        // 3) ADD the updated index entry
        await userRef.update({
          addOns: firebase.firestore.FieldValue.arrayUnion({
            address: addOnData.id,
            type: newAddOn.type,
            name: newAddOn.name,
            notes: newAddOn.notes,
            url: newAddOn.url,
            subtype: newAddOn.subtype
          })
        });

        modalStream.set(version);
        showToast("AddOn updated!", { type: 'success' });
      }
    } catch (err) {
      showToast("Error: " + err.message, { type: 'error' });
    } finally {
      modal.remove();
    }
  }, { accent: true }, themeStream);

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(saveBtn);
  content.appendChild(btnRow);

  // ——— Final Assembly ———
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modalStream.set(null);
      modal.remove();
    }
  });

  return modalStream;
}

async function refreshAddOns() {
  try {
    console.log("Fetching AddOns...");
    const snap = await db.collection('users').doc(currentUser.uid).get();
    const list = (snap.data()?.addOns) || [];
    console.log("Fetched AddOns: ", list);
    addOnsStream.set(list);
  } catch (err) {
    console.error("Failed to fetch AddOns: ", err);
  }
}

function truncate(str, length = 40) {
  if (typeof str !== 'string') return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

function openAddOnChooserModal(currentUser, themeStream = currentTheme) {

  refreshAddOns();
  const modalStream = new Stream(null);

  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    width: '80%',
    maxWidth: '800px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: themeStream.get().colors.surface || '#fff',
    color: themeStream.get().colors.foreground || '#000',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  });
  modal.appendChild(content);

  const title = document.createElement('h2');
  title.textContent = "Choose or Manage AddOn";
  content.appendChild(title);

  const listContainer = document.createElement('div');
  Object.assign(listContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  });
  content.appendChild(listContainer);

  const typeIcons = {
    'Knowledge': '📚',
    'Business': '💼',
    'Requirement': '📝',
    'Lifecycle': '🔄',
    'Measurement': '📊',
    'Condition': '⚖️',
    'Material': '🧱',
    'Role': '👤',
    'Equipment': '🛠️',
    'System': '⚙️',
    'Tool': '🧰',
    'Information': 'ℹ️'
  };

  addOnsStream.subscribe(addOns => {
    listContainer.innerHTML = '';

    if (!addOns.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No AddOns available.';
      listContainer.appendChild(empty);
      return;
    }

    // ✅ Sort addOns by type alphabetically
    const sortedAddOns = [...addOns].sort((a, b) => {
      const typeA = (a.type || '').toUpperCase();
      const typeB = (b.type || '').toUpperCase();
      if (typeA < typeB) return -1;
      if (typeA > typeB) return 1;
      return 0;
    });

    // Now iterate over sortedAddOns
    sortedAddOns.forEach((addOn, index) => {
      const item = document.createElement('div');
      Object.assign(item.style, {
        border: `1px solid ${themeStream.get().colors.border}`,
        borderRadius: '6px',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      });

      const icon = document.createElement('span');
      icon.textContent = typeIcons[addOn.type] || '❓';
      icon.style.fontSize = '1.5rem';
      item.appendChild(icon);

      const truncatedNotes = truncate(addOn.notes, 40);
      const label = document.createElement('div');
      label.textContent = `${addOn.name} — ${addOn.type || ''} — ${addOn.subtype || ''} — ${truncatedNotes}`;
      label.style.flex = '1';
      item.appendChild(label);

      const selectBtn = document.createElement('button');
      selectBtn.textContent = 'Select';
      selectBtn.style.cursor = 'pointer';
      selectBtn.onclick = () => {
        modalStream.set(addOn);
        closeModal();
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.style.cursor = 'pointer';
      editBtn.onclick = async () => {
        try {
          const fullData = await loadLatestAddOnVersion(currentUser, addOn.address);
          const editStream = openAddOnModal(currentUser, 'edit', fullData, themeStream);
          editStream.subscribe(updated => {
            if (updated) {
              showToast("AddOn updated!", { type: 'success' });
              refreshAddOns();
            }
          });
        } catch (err) {
          showToast("Failed to load AddOn: " + err.message, { type: 'error' });
        }
      };

      const removeBtn = reactiveButton(new Stream("Remove"), async () => {
        const confirmed = await showConfirmationDialog("Are you sure you want to remove this AddOn from this list?", themeStream);
        if (confirmed) {
          addOns.splice(addOns.indexOf(addOn), 1);
          addOnsStream.set([...addOns]);
        }
      }, {        
        padding: '0.25rem 0.75rem',
        borderRadius: '4px'
      }, themeStream);

      item.appendChild(selectBtn);
      item.appendChild(editBtn);
      item.appendChild(removeBtn);

      listContainer.appendChild(item);
    });
  });


  const cancelBtn = reactiveButton(new Stream("Cancel"), () => {
    modalStream.set(null);
    closeModal();
  }, { outline: true }, themeStream);

  const newBtn = reactiveButton(new Stream("➕ New AddOn"), () => {
    const addStream = openAddOnModal(currentUser, 'add', null, themeStream);
    addStream.subscribe(newAddOn => {
      if (newAddOn) {
        showToast("AddOn added!", { type: 'success' });
        refreshAddOns();
      }
    });
  }, { accent: true }, themeStream);

  content.appendChild(row([ cancelBtn, newBtn ], { justify: 'space-between', gap: '1rem' }, themeStream));

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.body.appendChild(modal);

  function closeModal() {
    modalStream.set(null);
    if (modal.parentNode) modal.remove();
  }

  return modalStream;
}



async function loadLatestAddOnVersion(currentUser, addOnId) {
  const doc = await db.collection('users')
    .doc(currentUser.uid)
    .collection('addOns')
    .doc(addOnId)
    .get();

  const data = doc.data();
  if (!data || !data.versions || data.versions.length === 0) {
    throw new Error("No versions found for this AddOn.");
  }

  const latestVersion = data.versions[data.versions.length - 1];

  return {
    ...latestVersion,
    id: addOnId
  };
}


function openAddOnHistoryModal(currentUser, addOnId, themeStream = currentTheme) {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999'
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    minWidth: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: themeStream.get().colors.surface || '#fff',
    color: themeStream.get().colors.foreground || '#000',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  });

  const title = document.createElement('h2');
  title.textContent = "AddOn Version History";
  content.appendChild(title);

  const versionsContainer = document.createElement('div');
  Object.assign(versionsContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  });
  content.appendChild(versionsContainer);

  // Load versions
  const loadHistory = async () => {
    try {
      const doc = await db.collection('users')
        .doc(currentUser.uid)
        .collection('addOns')
        .doc(addOnId)
        .get();

      const data = doc.data();
      if (!data || !data.versions || data.versions.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = "No versions found.";
        versionsContainer.appendChild(msg);
        return;
      }

      // Clear container
      versionsContainer.innerHTML = '';

      data.versions.forEach((version, idx) => {
        const versionItem = document.createElement('div');
        Object.assign(versionItem.style, {
          border: `1px solid ${themeStream.get().colors.border}`,
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem'
        });

        const header = document.createElement('strong');
        header.textContent = `Version ${idx + 1} — ${new Date(version.timestamp).toLocaleString()}`;
        versionItem.appendChild(header);

        const nameEl = document.createElement('div');
        nameEl.textContent = `Name: ${version.name}`;
        versionItem.appendChild(nameEl);

        const typeEl = document.createElement('div');
        typeEl.textContent = `Type: ${version.type}`;
        versionItem.appendChild(typeEl);

        const notesEl = document.createElement('div');
        notesEl.textContent = `Notes: ${version.notes}`;
        versionItem.appendChild(notesEl);

        const urlEl = document.createElement('div');
        urlEl.textContent = `URL: ${version.url || '—'}`;
        versionItem.appendChild(urlEl);

        versionsContainer.appendChild(versionItem);
      });
    } catch (err) {
      const errorMsg = document.createElement('p');
      errorMsg.textContent = "Failed to load history: " + err.message;
      errorMsg.style.color = 'red';
      versionsContainer.appendChild(errorMsg);
    }
  };

  // Load on open
  loadHistory();

  // Close button
  const closeBtn = reactiveButton(new Stream("Close"), () => {
    modal.remove();
  }, { outline: true }, themeStream);

  content.appendChild(closeBtn);

  modal.appendChild(content);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
