import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XMarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { toast } from '@/components/ui/Toaster'
import DashboardLayout from '@/components/DashboardLayout'

type FormData = {
  phoneNumber: string
  whatsappNumber: string
  crmWebhookUrl: string
  welcomeMessage: string
  accentColor: string
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  showOnMobile: boolean
  callButtonText: string
  smsButtonText: string
  whatsappButtonText: string
  caseValueButtonText: string
  formTitle: string
  formSubtitle: string
  caseValueFormFields: {
    label: string
    type: string
    required: boolean
  }[]
}

export default function ScriptGenerator() {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [scriptCode, setScriptCode] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      phoneNumber: '',
      whatsappNumber: '',
      crmWebhookUrl: '',
      welcomeMessage: 'How can we help you today?',
      accentColor: '#4f46e5',
      position: 'bottom-right',
      showOnMobile: true,
      callButtonText: 'Call Now',
      smsButtonText: 'Text Us',
      whatsappButtonText: 'WhatsApp',
      caseValueButtonText: 'Value My Case',
      formTitle: 'Get in Touch',
      formSubtitle: 'We\'ll get back to you as soon as possible.',
    },
  })
  
  const [customFields, setCustomFields] = useState<
    { id: string; label: string; type: string; required: boolean }[]
  >([
    {
      id: 'name-field',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      id: 'email-field',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      id: 'phone-field',
      label: 'Phone Number',
      type: 'tel',
      required: true,
    },
    {
      id: 'message-field',
      label: 'Brief Description of Your Case',
      type: 'textarea',
      required: false,
    },
  ])
  
  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: Math.random().toString(36).substring(2, 9),
        label: '',
        type: 'text',
        required: false,
      },
    ])
  }
  
  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }
  
  const updateCustomField = (
    id: string,
    field: 'label' | 'type' | 'required',
    value: string | boolean
  ) => {
    setCustomFields(
      customFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }
  
  const onSubmit = (data: FormData) => {
    // Convert custom fields to the format expected
    const formattedFields = customFields
      .filter((field) => field.label.trim() !== '')
      .map((field) => ({
        label: field.label,
        type: field.type,
        required: field.required,
      }))
    
    // Generate the configuration
    const config = {
      locationId: data.crmWebhookUrl,
      phoneNumber: data.phoneNumber,
      whatsappNumber: data.whatsappNumber,
      widgetConfig: {
        welcomeMessage: data.welcomeMessage,
        accentColor: data.accentColor,
        position: data.position,
        showOnMobile: data.showOnMobile,
        callButtonText: data.callButtonText,
        smsButtonText: data.smsButtonText,
        whatsappButtonText: data.whatsappButtonText,
        caseValueButtonText: data.caseValueButtonText,
        formTitle: data.formTitle,
        formSubtitle: data.formSubtitle,
      },
      formFields: formattedFields,
    }
    
    // Generate the script code
    const script = `
<!-- Case Queue Widget -->
<link rel="stylesheet" href="https://app.casequeue.com/widget/style.css">
<script>
  (function(c,a,s,e,q,u,e,u,e) {
    c['CaseQueueConfig'] = {
      locationId: "${config.locationId}",
      config: ${JSON.stringify(config, null, 2)}
    };
    
    // Create widget button
    var widgetButton = document.createElement('div');
    widgetButton.className = 'cq-widget-button';
    widgetButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    widgetButton.style.backgroundColor = "${config.widgetConfig.accentColor}";
    
    // Position the button according to settings
    widgetButton.style.position = 'fixed';
    if ("${config.widgetConfig.position}".includes('bottom')) {
      widgetButton.style.bottom = '20px';
    } else {
      widgetButton.style.top = '20px';
    }
    
    if ("${config.widgetConfig.position}".includes('right')) {
      widgetButton.style.right = '20px';
    } else {
      widgetButton.style.left = '20px';
    }
    
    // Add it to the body
    document.body.appendChild(widgetButton);
    
    // Create the widget modal (initially hidden)
    var widgetModal = document.createElement('div');
    widgetModal.className = 'cq-widget-modal';
    widgetModal.style.display = 'none';
    
    // Modal header
    var modalHeader = document.createElement('div');
    modalHeader.className = 'cq-modal-header';
    modalHeader.style.backgroundColor = "${config.widgetConfig.accentColor}";
    
    var modalTitle = document.createElement('h3');
    modalTitle.textContent = "${config.widgetConfig.welcomeMessage}";
    
    var closeButton = document.createElement('button');
    closeButton.className = 'cq-close-button';
    closeButton.innerHTML = '&times;';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Modal content
    var modalContent = document.createElement('div');
    modalContent.className = 'cq-modal-content';
    
    // Button container
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'cq-button-container';
    
    // Call button
    var callButton = document.createElement('button');
    callButton.className = 'cq-action-button cq-call-button';
    callButton.textContent = "${config.widgetConfig.callButtonText}";
    callButton.onclick = function() {
      window.location.href = 'tel:${config.phoneNumber}';
    };
    
    // SMS button (shows form)
    var smsButton = document.createElement('button');
    smsButton.className = 'cq-action-button cq-sms-button';
    smsButton.textContent = "${config.widgetConfig.smsButtonText}";
    
    // WhatsApp button
    var whatsappButton = document.createElement('button');
    whatsappButton.className = 'cq-action-button cq-whatsapp-button';
    whatsappButton.textContent = "${config.widgetConfig.whatsappButtonText}";
    whatsappButton.onclick = function() {
      window.open('https://wa.me/${config.whatsappNumber}', '_blank');
    };
    
    // Case Value button (shows form)
    var caseValueButton = document.createElement('button');
    caseValueButton.className = 'cq-action-button cq-case-value-button';
    caseValueButton.textContent = "${config.widgetConfig.caseValueButtonText}";
    
    buttonContainer.appendChild(callButton);
    buttonContainer.appendChild(smsButton);
    buttonContainer.appendChild(whatsappButton);
    buttonContainer.appendChild(caseValueButton);
    
    // Form container (initially hidden)
    var formContainer = document.createElement('div');
    formContainer.className = 'cq-form-container';
    formContainer.style.display = 'none';
    
    var formTitle = document.createElement('h4');
    formTitle.textContent = "${config.widgetConfig.formTitle}";
    
    var formSubtitle = document.createElement('p');
    formSubtitle.textContent = "${config.widgetConfig.formSubtitle}";
    
    var contactForm = document.createElement('form');
    contactForm.className = 'cq-contact-form';
    
    // Create form fields based on configuration
    ${JSON.stringify(config.formFields)}.forEach(function(field) {
      var fieldContainer = document.createElement('div');
      fieldContainer.className = 'cq-form-field';
      
      var label = document.createElement('label');
      label.textContent = field.label;
      if (field.required) {
        label.textContent += ' *';
      }
      
      var input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }
      
      input.name = field.label.toLowerCase().replace(/\\s+/g, '-');
      input.required = field.required;
      
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      contactForm.appendChild(fieldContainer);
    });
    
    // Submit button
    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'cq-submit-button';
    submitButton.textContent = 'Submit';
    submitButton.style.backgroundColor = "${config.widgetConfig.accentColor}";
    
    contactForm.appendChild(submitButton);
    
    // Add event listener for form submission
    contactForm.onsubmit = function(e) {
      e.preventDefault();
      
      // Collect form data
      var formData = new FormData(contactForm);
      var formObject = {};
      formData.forEach(function(value, key) {
        formObject[key] = value;
      });
      
      // Send to CRM integration
      fetch('https://app.casequeue.com/api/submit?webhookUrl=' + "${config.locationId}", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
      })
      .then(response => response.json())
      .then(data => {
        // Show success message
        formContainer.innerHTML = '<div class="cq-success-message"><h4>Thank you!</h4><p>Your message has been submitted. We\'ll get back to you shortly.</p></div>';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your form. Please try again.');
      });
    };
    
    formContainer.appendChild(formTitle);
    formContainer.appendChild(formSubtitle);
    formContainer.appendChild(contactForm);
    
    modalContent.appendChild(buttonContainer);
    modalContent.appendChild(formContainer);
    
    widgetModal.appendChild(modalHeader);
    widgetModal.appendChild(modalContent);
    
    document.body.appendChild(widgetModal);
    
    // Event listeners
    widgetButton.addEventListener('click', function() {
      widgetModal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', function() {
      widgetModal.style.display = 'none';
      formContainer.style.display = 'none';
      buttonContainer.style.display = 'flex';
    });
    
    smsButton.addEventListener('click', function() {
      buttonContainer.style.display = 'none';
      formContainer.style.display = 'block';
    });
    
    caseValueButton.addEventListener('click', function() {
      buttonContainer.style.display = 'none';
      formContainer.style.display = 'block';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === widgetModal) {
        widgetModal.style.display = 'none';
        formContainer.style.display = 'none';
        buttonContainer.style.display = 'flex';
      }
    });

    // Inject the CSS
    var style = document.createElement('style');
    style.innerHTML = \`
      .cq-widget-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 9999;
      }
      
      .cq-widget-button svg {
        width: 30px;
        height: 30px;
      }
      
      .cq-widget-modal {
        position: fixed;
        z-index: 10000;
        ${config.widgetConfig.position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
        ${config.widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 350px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        overflow: hidden;
      }
      
      .cq-modal-header {
        padding: 15px 20px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .cq-modal-header h3 {
        margin: 0;
        font-size: 18px;
      }
      
      .cq-close-button {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
      }
      
      .cq-modal-content {
        padding: 20px;
      }
      
      .cq-button-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .cq-action-button {
        flex: 1 0 40%;
        padding: 15px 10px;
        border: none;
        border-radius: 5px;
        background-color: #f0f4f8;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .cq-action-button:hover {
        background-color: #e1e8ed;
      }
      
      .cq-form-container {
        margin-top: 15px;
      }
      
      .cq-form-container h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
      }
      
      .cq-form-container p {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: #666;
      }
      
      .cq-form-field {
        margin-bottom: 15px;
      }
      
      .cq-form-field label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
      }
      
      .cq-form-field input,
      .cq-form-field textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .cq-form-field textarea {
        min-height: 80px;
      }
      
      .cq-submit-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        cursor: pointer;
      }
      
      .cq-success-message {
        text-align: center;
        padding: 20px 0;
      }
      
      .cq-success-message h4 {
        color: #2C7A51;
        margin-bottom: 10px;
      }
      
      @media (max-width: 480px) {
        .cq-widget-modal {
          width: calc(100% - 40px);
          ${config.widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        }
      }
    \`;
    document.head.appendChild(style);
    
  })();
</script>
<!-- End Case Queue Widget -->
`.trim()
    
    setScriptCode(script)
    toast('Script generated successfully!', 'success')
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode)
    setCopiedToClipboard(true)
    toast('Script copied to clipboard!', 'success')
    
    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 2000)
  }
  
  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Website Widget Generator</h1>
        <p className="mb-8 text-gray-600">
          Customize how the CaseFlowPro widget appears on your website and generate an installation script that integrates with your CRM.
        </p>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-6 text-lg font-semibold">Widget Configuration</h2>
              
              <div className="mb-6 border-b pb-6">
                <h3 className="mb-4 text-md font-medium">Contact Information</h3>
                
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
                      Phone Number (Call Button)
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      className="input"
                      placeholder="+1 (555) 123-4567"
                      {...register('phoneNumber', { required: 'Phone number is required' })}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="whatsappNumber" className="block mb-2 text-sm font-medium text-gray-700">
                      WhatsApp Number (without + symbol)
                    </label>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      className="input"
                      placeholder="1555123456"
                      {...register('whatsappNumber', { required: 'WhatsApp number is required' })}
                    />
                    {errors.whatsappNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="crmWebhookUrl" className="block mb-2 text-sm font-medium text-gray-700">
                    CRM Webhook URL
                  </label>
                  <input
                    id="crmWebhookUrl"
                    type="text"
                    className="input"
                    {...register('crmWebhookUrl', { required: 'CRM Webhook URL is required' })}
                  />
                  {errors.crmWebhookUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.crmWebhookUrl.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    This URL is used to connect form submissions to your CRM or automation platform.
                  </p>
                </div>
              </div>
              
              <div className="mb-6 border-b pb-6">
                <h3 className="mb-4 text-md font-medium">Appearance Settings</h3>
                
                <div className="mb-6">
                  <label htmlFor="welcomeMessage" className="block mb-2 text-sm font-medium text-gray-700">
                    Welcome Message
                  </label>
                  <input
                    id="welcomeMessage"
                    type="text"
                    className="input"
                    {...register('welcomeMessage', { required: 'Welcome message is required' })}
                  />
                  {errors.welcomeMessage && (
                    <p className="mt-1 text-sm text-red-600">{errors.welcomeMessage.message}</p>
                  )}
                </div>
                
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="accentColor" className="block mb-2 text-sm font-medium text-gray-700">
                      Accent Color
                    </label>
                    <div className="flex">
                      <input
                        id="accentColor"
                        type="color"
                        className="w-12 h-10 rounded-l-md border-r-0"
                        {...register('accentColor')}
                      />
                      <input
                        type="text"
                        className="input rounded-l-none flex-1"
                        value={watch('accentColor')}
                        onChange={(e) => setValue('accentColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block mb-2 text-sm font-medium text-gray-700">
                      Widget Position
                    </label>
                    <select
                      id="position"
                      className="input"
                      {...register('position')}
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    id="showOnMobile"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                    {...register('showOnMobile')}
                  />
                  <label htmlFor="showOnMobile" className="block ml-2 text-sm text-gray-700">
                    Show widget on mobile devices
                  </label>
                </div>
              </div>
              
              <div className="mb-6 border-b pb-6">
                <h3 className="mb-4 text-md font-medium">Button Labels</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="callButtonText" className="block mb-2 text-sm font-medium text-gray-700">
                      Call Button Text
                    </label>
                    <input
                      id="callButtonText"
                      type="text"
                      className="input"
                      {...register('callButtonText', { required: 'Call button text is required' })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="smsButtonText" className="block mb-2 text-sm font-medium text-gray-700">
                      SMS Button Text
                    </label>
                    <input
                      id="smsButtonText"
                      type="text"
                      className="input"
                      {...register('smsButtonText', { required: 'SMS button text is required' })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsappButtonText" className="block mb-2 text-sm font-medium text-gray-700">
                      WhatsApp Button Text
                    </label>
                    <input
                      id="whatsappButtonText"
                      type="text"
                      className="input"
                      {...register('whatsappButtonText', { required: 'WhatsApp button text is required' })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="caseValueButtonText" className="block mb-2 text-sm font-medium text-gray-700">
                      Case Value Button Text
                    </label>
                    <input
                      id="caseValueButtonText"
                      type="text"
                      className="input"
                      {...register('caseValueButtonText', { required: 'Case value button text is required' })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6 border-b pb-6">
                <h3 className="mb-4 text-md font-medium">Form Settings</h3>
                
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="formTitle" className="block mb-2 text-sm font-medium text-gray-700">
                      Form Title
                    </label>
                    <input
                      id="formTitle"
                      type="text"
                      className="input"
                      {...register('formTitle', { required: 'Form title is required' })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="formSubtitle" className="block mb-2 text-sm font-medium text-gray-700">
                      Form Subtitle
                    </label>
                    <input
                      id="formSubtitle"
                      type="text"
                      className="input"
                      {...register('formSubtitle')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-4 text-md font-medium">Form Fields</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Configure the fields that will appear in your SMS and Case Value forms. The same form will be used for both buttons.
                </p>
                
                <div className="mb-6 space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center p-4 border rounded-md">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Field Label</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 mt-1 border border-gray-300 rounded-md"
                            value={field.label}
                            onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                            placeholder="Enter label"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-gray-500">Field Type</label>
                          <select
                            className="w-full px-2 py-1 mt-1 border border-gray-300 rounded-md"
                            value={field.type}
                            onChange={(e) => updateCustomField(field.id, 'type', e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Telephone</option>
                            <option value="textarea">Multiline Text</option>
                            <option value="select">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                            checked={field.required}
                            onChange={(e) => updateCustomField(field.id, 'required', e.target.checked)}
                          />
                          <label className="block ml-2 text-sm text-gray-700">Required</label>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className="ml-4 text-gray-400 hover:text-red-500"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-md hover:bg-primary-50"
                    onClick={addCustomField}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Custom Field
                  </button>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t">
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
                >
                  Generate Script
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <div className="sticky p-6 bg-white rounded-lg shadow top-6">
              <h2 className="mb-4 text-lg font-semibold">Installation Code</h2>
              
              {scriptCode ? (
                <>
                  <div className="p-4 mb-4 overflow-auto font-mono text-sm bg-gray-800 text-gray-200 rounded-md max-h-96">
                    <pre>{scriptCode}</pre>
                  </div>
                  
                  <button
                    type="button"
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-center text-white rounded-md bg-primary-600 hover:bg-primary-700"
                    onClick={copyToClipboard}
                  >
                    <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                    {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  
                  <div className="mt-6 text-gray-600">
                    <h3 className="mb-2 text-sm font-medium">Installation Instructions</h3>
                    <ol className="pl-5 space-y-2 text-sm list-decimal">
                      <li>Copy the code above to your clipboard</li>
                      <li>Paste it just before the closing <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">&lt;/body&gt;</code> tag on every page of your website</li>
                      <li>Save your changes and refresh your website to see the widget</li>
                    </ol>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-md">
                  <p>Complete the form and click "Generate Script" to get your installation code.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 