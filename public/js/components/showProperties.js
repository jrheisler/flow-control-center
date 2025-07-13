// 1) Create the sidebar container (hidden by default)
  const propsSidebar = document.createElement('div');
Object.assign(propsSidebar.style, {
  position:    'absolute',
  top:         '0',
  right:       '-400px',       // slide it offscreen initially
  width:       '300px',
  height:      '100%',
  background:  '#fff',
  boxShadow:   '-2px 0 6px rgba(0,0,0,0.2)',
  padding:     '1rem',
  overflowY:   'auto',
  overflowX:   'hidden',       // prevent horizontal scroll if not needed
  display:     'flex',
  flexDirection: 'column',
  transition:  'right 0.3s',
  zIndex: '1000',
});
  document.body.appendChild(propsSidebar);


const BPMN_PROPERTY_MAP = {
  'bpmn:Task': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:UserTask': [
    'name', 'documentation', 'assignee',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime',   'kpiNotes'
  ],
  'bpmn:ServiceTask': [
    'name', 'documentation', 'implementation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:ScriptTask': [
    'name', 'documentation', 'script', 'scriptFormat',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:CallActivity': [
    'name', 'documentation', 'calledElement',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime',   'kpiNotes'
  ],
  'bpmn:SubProcess': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:StartEvent': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime',   'kpiNotes'
  ],
  'bpmn:EndEvent': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
    'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:IntermediateCatchEvent': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:IntermediateThrowEvent': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:BoundaryEvent': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime',   'kpiNotes'
  ],
  'bpmn:ExclusiveGateway': [
    'name', 'documentation', 'default',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:InclusiveGateway': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:ParallelGateway': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:ComplexGateway': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
    'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:EventBasedGateway': [
    'name', 'documentation',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:SequenceFlow': [
    'name', 'documentation', 'conditionExpression',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
    'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:DataObjectReference': [
    'name', 'itemSubjectRef',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:DataStoreReference': [
    'name', 'itemSubjectRef',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
    'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:Participant': [
    'name', 'processRef',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:Lane': [
    'name',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:TextAnnotation': [
    'text',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
    'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ],
  'bpmn:Group': [
    'name', 'categoryValueRef',
    'estimatedDuration', 'actualDuration',
  'costEstimate', 'ownerRole',
  'inputQuality', 'outputQuality',
  'processOwner', 'creator', 'downTime', 'upTime', 'changeOverTime', 'perCompleteAccurate', 'availability', 'leadTime', 
  'kpiNotes'
  ]
};


  const FIELD_DEFINITIONS = [
  { key: 'name',              label: 'Name',                type: 'text' },
  { key: 'documentation',     label: 'Documentation',       type: 'textarea' },
  { key: 'assignee',          label: 'Assignee',            type: 'text' },
  { key: 'calledElement',     label: 'Called Element',      type: 'text' },
  { key: 'script',            label: 'Script Content',      type: 'textarea' },
  { key: 'scriptFormat',      label: 'Script Format',       type: 'text' },
  { key: 'implementation',    label: 'Implementation',      type: 'text' },
  { key: 'default',           label: 'Default Flow ID',     type: 'text' },
  { key: 'conditionExpression', label: 'Condition (for flow)', type: 'textarea' },
  { key: 'itemSubjectRef',    label: 'Data Type (ItemRef)', type: 'text' },
  { key: 'processRef',        label: 'Linked Process ID',   type: 'text' },
  { key: 'text',              label: 'Annotation Text',     type: 'textarea' },
  { key: 'processOwner',      label: 'Process Owner',       type: 'text' },
  { key: 'creator',           label: 'Creator',             type: 'text' },
  { key: 'categoryValueRef',  label: 'Category Reference',  type: 'text' },
  { key: 'estimatedDuration',  label: 'Estimated Duration (mins)', type: 'text' },
  { key: 'actualDuration',     label: 'Actual Duration (mins)',    type: 'text' },
  { key: 'costEstimate',       label: 'Estimated Cost ($)',        type: 'text' },
  { key: 'ownerRole',          label: 'Responsible Role',          type: 'text' },
  { key: 'inputQuality',       label: 'Input Quality Score',       type: 'text' },
  { key: 'outputQuality',      label: 'Output Quality Score',      type: 'text' },
  { key: 'downTime',           label: 'Down Time',                 type: 'text' },
  { key: 'upTime',             label: 'Up Time',                   type: 'text' },
  { key: 'changeOverTime',     label: 'Change Over Time',          type: 'text' },
  { key: 'perCompleteAccurate', label: 'Percent Complete and Accurate',          type: 'text' },
  { key: 'availability ',       label: 'Availability',            type: 'text' },
  { key: 'leadTime ',           label: 'Lead Time',               type: 'text' },  
  { key: 'kpiNotes',           label: 'KPI Notes',                 type: 'textarea' },
 
];

function openUrlModal(url) {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    position: 'relative',
  });

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '0.5rem 1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  });
  closeBtn.addEventListener('click', () => modal.remove());

  content.appendChild(iframe);
  content.appendChild(closeBtn);
  modal.appendChild(content);

  document.body.appendChild(modal);
}

function showProperties(element, modeling, moddle, currentUser) {
  const bo = element.businessObject;
  const type = element.businessObject.$type;
  const fieldKeys = BPMN_PROPERTY_MAP[type] || [];

  const fieldsToShow = FIELD_DEFINITIONS.filter(f => fieldKeys.includes(f.key));

  propsSidebar.innerHTML = '';
  if (propsSidebar._unsubTheme) {
    propsSidebar._unsubTheme();
  }

  const form = document.createElement('form');

  // Local AddOns array
  let currentAddOns = [];

  // Hidden field to hold JSON value for saving
  const addOnsField = document.createElement('input');
  addOnsField.type = 'hidden';
  addOnsField.name = 'addOns';
  addOnsField.value = '';

  // Load existing addOns value from element
  let existingVal = bo.get('addOns');
  if (existingVal != null) {
    addOnsField.value = existingVal;
    try {
      currentAddOns = JSON.parse(existingVal);
    } catch (e) {
      console.warn("Invalid existing AddOns JSON; starting fresh");
      currentAddOns = [];
    }
  }

  // Attach button
  const attachBtn = reactiveButton(
    new Stream("Attach AddOn"),
    () => {
      openAddOnChooserModal(currentUser, currentTheme).subscribe(selectedAddOn => {
        if (!selectedAddOn) return;

        console.log("Selected AddOn:", selectedAddOn);

        const newEntry = {
          id: selectedAddOn.address,
          ...selectedAddOn
        };

        if (!currentAddOns.some(a => a.id === newEntry.id)) {
          currentAddOns.push(newEntry);
        }

        // Update hidden field value
        addOnsField.value = JSON.stringify(currentAddOns, null, 2);

        // Update visual list
        renderAddOnsList();

        console.log("Updated AddOns array:", currentAddOns);
      });
    },
    { accent: true },
    currentTheme
  );

  // AddOns visual list
  const addOnsListContainer = document.createElement('div');
  addOnsListContainer.style.display = 'flex';
  addOnsListContainer.style.flexDirection = 'column';
  addOnsListContainer.style.gap = '0.5rem';
  addOnsListContainer.style.marginTop = '1rem';
  addOnsListContainer.style.padding = '0.5rem';
  
  
  function renderAddOnsList() {
  addOnsListContainer.innerHTML = '';

  if (!currentAddOns.length) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No AddOns attached yet.';
    addOnsListContainer.appendChild(emptyMsg);
    return;
  }

  currentAddOns.forEach((addOn, index) => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.padding = '0.5rem 0';
  

  // — Row 1: Image (icon) and Type
  const row1 = document.createElement('div');
  row1.style.display = 'flex';
  row1.style.alignItems = 'center';
  row1.style.gap = '0.5rem';

  const icon = document.createElement('span');
  icon.textContent = typeIcons[addOn.type] || '❓';
  icon.style.fontSize = '1.5rem';
  row1.appendChild(icon);

  const typeText = document.createElement('div');
  typeText.textContent = `${addOn.type || 'Unknown Type'}`;
  typeText.style.fontWeight = 'bold';
  row1.appendChild(typeText);

  container.appendChild(row1);

  // — Row 2a: Subtype
  if (addOn.name) {
    const row2a = document.createElement('div');
    row2a.textContent = `Name: ${addOn.name}`;
    row2a.style.marginLeft = '2rem';
    container.appendChild(row2a);
  }

  // — Row 2: Subtype
  if (addOn.subtype) {
    const row2 = document.createElement('div');
    row2.textContent = `Subtype: ${addOn.subtype}`;
    row2.style.marginLeft = '2rem';
    container.appendChild(row2);
  }

  // — Row 3: Notes
  if (addOn.notes) {
    const row3 = document.createElement('div');
    row3.textContent = `Notes: ${addOn.notes.length > 80 ? addOn.notes.slice(0, 80) + '…' : addOn.notes}`;
    row3.style.marginLeft = '2rem';
    container.appendChild(row3);
  }

  // — Row 4: URL link
  if (addOn.url) {
    if (!/^https?:\/\//i.test(addOn.url)) {
      addOn.url = 'https://' + addOn.url;
    }

    const row4 = document.createElement('div');

    const link = document.createElement('a');
    link.href = addOn.url;
    link.textContent = 'Open URL in New Tab';
    link.target = '_blank';
    link.style.marginLeft = '2rem';
    link.style.color = '#007BFF';
    link.style.textDecoration = 'underline';
    link.style.cursor = 'pointer';

    row4.appendChild(link);
    container.appendChild(row4);
  }

    // — Row 5: Remove button
    const row5 = document.createElement('div');
    row5.style.marginLeft = '2rem';
    row5.style.marginTop = '0.5rem';

    const removeBtn = reactiveButton(
      new Stream('Remove'),
      async () => {
        const confirmed = await showConfirmationDialog('Are you sure you want to remove this AddOn?', currentTheme);
        if (confirmed) {
          currentAddOns.splice(index, 1);
          addOnsField.value = JSON.stringify(currentAddOns, null, 2);
          renderAddOnsList();
        }
      },
      // ✅ Use a fresh options object literal inside each call
      {
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
      },
      currentTheme
    );

    row5.appendChild(removeBtn);
    container.appendChild(row5);
    container.appendChild(divider({ margin: '1rem 0' }, currentTheme));  


  addOnsListContainer.appendChild(container);
  });

}


  // Initial render
  renderAddOnsList();

  // Save button
  const saveBtn = reactiveButton(
    new Stream('Save'),
    () => {
      const data = new FormData(form);
      const props = {};
      const standardKeys = BPMN_PROPERTY_MAP[bo.$type] || [];

      standardKeys.forEach(key => {
        const val = data.get(key);
        if (val !== null) {
          props[key] = val;
        }
      });

      props['addOns'] = addOnsField.value;

      modeling.updateProperties(element, props);
      hideSidebar();
    },
    {
      accent: true,
      size: '1rem',
      padding: '0.5rem 1rem',
      // Remove margin to keep them tight
      margin: '0',
      title: 'Save changes'
    },
    currentTheme
  );

  // Cancel button
  const cancelBtn = reactiveButton(
    new Stream('Cancel'),
    () => {
      hideSidebar();
    },
    {
      outline: true,
      size: '1rem',
      padding: '0.5rem 1rem',
      margin: '0', // No extra margin
      title: 'Discard changes'
    },
    currentTheme
  );

  const topBtnRow = row(
    [saveBtn, cancelBtn],
    {
      justify: 'flex-start', // Move them together to the right
      gap: '0.5rem',      // Smaller gap between buttons
      marginBottom: '1rem'
    },
    currentTheme
  );


  // Append top buttons first
  form.appendChild(topBtnRow);
  
  form.appendChild(divider({ margin: '1rem 0' }, currentTheme));

  // Fields
  fieldsToShow.forEach(({ key, label, type }) => {
    if (key === 'addOns') {
      // Already handled
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '0.75rem';

    const lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.style.display = 'block';
    wrapper.appendChild(lbl);

    let input;
    if (type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = type;
    }
    input.name = key;
    input.style.width = '100%';

    let val = bo.get(key);
    if (val == null) {
      const extEl = bo.extensionElements;
      if (extEl) {
        const ext = (extEl.values || []).find(v => v.$type === 'custom:Attribute' && v.name === key);
        if (ext) val = ext.value;
      }
    }
    if (val != null) input.value = val;

    if (key === 'url') {
      let link = document.createElement('a');
      link.textContent = 'Open';
      link.style.display = input.value ? 'inline-block' : 'none';
      link.style.margin = '0.25rem 0 0 0';
      link.target = '_blank';
      link.href = input.value;
      wrapper.appendChild(link);

      input.addEventListener('input', () => {
        const u = input.value.trim();
        if (u) {
          link.href = u;
          link.style.display = 'inline-block';
        } else {
          link.style.display = 'none';
        }
      });
    }

    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });





  // Append
  form.appendChild(attachBtn);
  form.appendChild(divider({ margin: '1rem 0' }, currentTheme));
  form.appendChild(addOnsListContainer);
  form.appendChild(addOnsField);
  form.style.paddingBottom = '3rem';



  propsSidebar.append(form);
  propsSidebar.style.right = '0';

  const unsub = currentTheme.subscribe(theme => {
    propsSidebar.style.backgroundColor = theme.colors.surface;
    propsSidebar.style.color = theme.colors.foreground;
    propsSidebar.style.fontFamily = theme.fonts.base;

    form.querySelectorAll('label').forEach(lbl => {
      lbl.style.color = theme.colors.foreground;
      lbl.style.fontFamily = theme.fonts.base;
    });

    form.querySelectorAll('input, textarea, button').forEach(el => {
      el.style.backgroundColor = theme.colors.background;
      el.style.color = theme.colors.foreground;
      el.style.border = `1px solid ${theme.colors.border}`;
      el.style.fontFamily = theme.fonts.base;
      el.style.padding = '0.25rem';
      el.style.borderRadius = '4px';
      if (el.tagName === 'BUTTON') {
        el.style.cursor = 'pointer';
      }
    });
  });

  propsSidebar._unsubTheme = unsub;
}


  // 2) Define the fields you want to edit


  // 3) Utility to get or create extensionElements for your custom attributes
function getOrCreateExtEl(bo, moddle) {
  if (!bo.extensionElements) {
    bo.extensionElements = moddle.create('bpmn:ExtensionElements', {
      values: []
    });
  }
  return bo.extensionElements;
}


      
  // hide helper cleans up subscription
  function hideSidebar() {
    propsSidebar.style.right = '-400px';
    if (propsSidebar._unsubTheme) {
      propsSidebar._unsubTheme();
      delete propsSidebar._unsubTheme;      
    }
  }

