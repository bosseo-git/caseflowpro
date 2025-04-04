import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

export default function ScriptGenerator() {
  const router = useRouter()
  const { user, loading } = useUser({
    redirectTo: '/login',
  })

  const [widgetSettings, setWidgetSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    position: 'right',
    companyName: '',
    companyPhone: '',
    companyWhatsApp: '',
    buttonLabels: {
      call: 'Call Now',
      sms: 'SMS Us',
      whatsapp: 'WhatsApp',
      value: 'Case Value'
    }
  })

  const [copied, setCopied] = useState(false)

  // Update company info when user data is loaded
  useEffect(() => {
    if (user?.companyName) {
      setWidgetSettings(prev => ({
        ...prev,
        companyName: user.companyName,
        companyPhone: user.phone || '',
        companyWhatsApp: user.whatsAppNumber || ''
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('buttonLabels.')) {
      const buttonType = name.split('.')[1]
      setWidgetSettings(prev => ({
        ...prev,
        buttonLabels: {
          ...prev.buttonLabels,
          [buttonType]: value
        }
      }))
    } else {
      setWidgetSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateScript = () => {
    const { primaryColor, secondaryColor, position, companyName, companyPhone, companyWhatsApp, buttonLabels } = widgetSettings
    
    return `
<!-- CaseFlowPro Widget -->
<script>
  (function() {
    // Create widget container
    var widget = document.createElement('div');
    widget.id = 'caseflowpro-widget';
    widget.style.position = 'fixed';
    widget.style.${position === 'right' ? 'right' : 'left'} = '20px';
    widget.style.bottom = '20px';
    widget.style.zIndex = '9999';
    
    // Create widget button
    var widgetButton = document.createElement('button');
    widgetButton.id = 'caseflowpro-toggle';
    widgetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    widgetButton.style.width = '60px';
    widgetButton.style.height = '60px';
    widgetButton.style.borderRadius = '50%';
    widgetButton.style.backgroundColor = '${primaryColor}';
    widgetButton.style.color = 'white';
    widgetButton.style.border = 'none';
    widgetButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    widgetButton.style.cursor = 'pointer';
    widgetButton.style.display = 'flex';
    widgetButton.style.alignItems = 'center';
    widgetButton.style.justifyContent = 'center';
    
    // Create widget modal
    var modal = document.createElement('div');
    modal.id = 'caseflowpro-modal';
    modal.style.position = 'absolute';
    modal.style.bottom = '70px';
    modal.style.${position === 'right' ? 'right' : 'left'} = '0';
    modal.style.width = '300px';
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    modal.style.padding = '16px';
    modal.style.display = 'none';
    modal.style.flexDirection = 'column';
    modal.style.gap = '12px';
    
    // Add company name to modal
    var companyTitle = document.createElement('h3');
    companyTitle.textContent = '${companyName || 'Contact Us'}';
    companyTitle.style.margin = '0 0 12px 0';
    companyTitle.style.fontSize = '18px';
    companyTitle.style.fontWeight = 'bold';
    companyTitle.style.textAlign = 'center';
    
    // Create buttons container
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'grid';
    buttonsContainer.style.gridTemplateColumns = '1fr 1fr';
    buttonsContainer.style.gap = '10px';
    
    // Create button function
    function createButton(icon, text, action, color) {
      var button = document.createElement('button');
      button.innerHTML = icon + '<span>' + text + '</span>';
      button.style.display = 'flex';
      button.style.flexDirection = 'column';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.padding = '16px 8px';
      button.style.backgroundColor = color;
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '6px';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      button.style.fontSize = '14px';
      button.style.gap = '8px';
      button.addEventListener('click', action);
      return button;
    }
    
    // Call button
    var callIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    var callButton = createButton(callIcon, '${buttonLabels.call}', function() {
      window.location.href = 'tel:${companyPhone}';
    }, '${primaryColor}');
    
    // SMS button
    var smsIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    var smsButton = createButton(smsIcon, '${buttonLabels.sms}', function() {
      // Create form for SMS intake
      var currentModal = document.getElementById('caseflowpro-form-modal');
      if (currentModal) {
        currentModal.remove();
      }
      
      var formModal = createFormModal('SMS');
      document.body.appendChild(formModal);
      formModal.style.display = 'block';
    }, '${secondaryColor}');
    
    // WhatsApp button
    var whatsappIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    var whatsappButton = createButton(whatsappIcon, '${buttonLabels.whatsapp}', function() {
      var phoneNumber = '${companyWhatsApp}'.replace(/[^0-9]/g, '');
      window.open('https://wa.me/' + phoneNumber, '_blank');
    }, '${primaryColor}');
    
    // Case Value button
    var valueIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    var valueButton = createButton(valueIcon, '${buttonLabels.value}', function() {
      // Create form for case value
      var currentModal = document.getElementById('caseflowpro-form-modal');
      if (currentModal) {
        currentModal.remove();
      }
      
      var formModal = createFormModal('Case Value');
      document.body.appendChild(formModal);
      formModal.style.display = 'block';
    }, '${secondaryColor}');
    
    // Create form modal function
    function createFormModal(formType) {
      var formModal = document.createElement('div');
      formModal.id = 'caseflowpro-form-modal';
      formModal.style.position = 'fixed';
      formModal.style.top = '0';
      formModal.style.left = '0';
      formModal.style.width = '100%';
      formModal.style.height = '100%';
      formModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      formModal.style.display = 'flex';
      formModal.style.alignItems = 'center';
      formModal.style.justifyContent = 'center';
      formModal.style.zIndex = '10000';
      
      var formContainer = document.createElement('div');
      formContainer.style.width = '90%';
      formContainer.style.maxWidth = '500px';
      formContainer.style.backgroundColor = 'white';
      formContainer.style.borderRadius = '8px';
      formContainer.style.padding = '24px';
      formContainer.style.position = 'relative';
      
      var closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.border = 'none';
      closeButton.style.background = 'none';
      closeButton.style.fontSize = '24px';
      closeButton.style.cursor = 'pointer';
      closeButton.addEventListener('click', function() {
        formModal.remove();
      });
      
      var formTitle = document.createElement('h3');
      formTitle.textContent = formType === 'SMS' ? 'Contact via SMS' : 'Get Case Value Estimate';
      formTitle.style.margin = '0 0 20px 0';
      formTitle.style.fontSize = '20px';
      formTitle.style.fontWeight = 'bold';
      
      var form = document.createElement('form');
      form.id = 'caseflowpro-form';
      form.style.display = 'flex';
      form.style.flexDirection = 'column';
      form.style.gap = '16px';
      
      // Common fields
      var nameInput = createFormInput('name', 'Name', 'text', true);
      var phoneInput = createFormInput('phone', 'Phone Number', 'tel', true);
      
      // Case value specific fields
      if (formType === 'Case Value') {
        var caseTypeInput = createFormInput('caseType', 'Case Type', 'text', true);
        var caseDetailsInput = createFormTextarea('caseDetails', 'Case Details');
      }
      
      var submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = formType === 'SMS' ? 'Send SMS' : 'Get Estimate';
      submitButton.style.padding = '12px';
      submitButton.style.backgroundColor = '${primaryColor}';
      submitButton.style.color = 'white';
      submitButton.style.border = 'none';
      submitButton.style.borderRadius = '6px';
      submitButton.style.cursor = 'pointer';
      submitButton.style.fontWeight = 'bold';
      submitButton.style.marginTop = '8px';
      
      form.appendChild(nameInput);
      form.appendChild(phoneInput);
      
      if (formType === 'Case Value') {
        form.appendChild(caseTypeInput);
        form.appendChild(caseDetailsInput);
      }
      
      form.appendChild(submitButton);
      
      // Submit form event
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gather form data
        var formData = {
          type: formType,
          name: form.elements.name.value,
          phone: form.elements.phone.value
        };
        
        if (formType === 'Case Value') {
          formData.caseType = form.elements.caseType.value;
          formData.caseDetails = form.elements.caseDetails.value;
        }
        
        // Send data to CRM
        sendToCRM(formData);
        
        // Replace form with thank you message
        formContainer.innerHTML = '';
        var thankYou = document.createElement('div');
        thankYou.style.textAlign = 'center';
        thankYou.style.padding = '20px';
        
        var thankYouTitle = document.createElement('h3');
        thankYouTitle.textContent = 'Thank You!';
        thankYouTitle.style.fontSize = '24px';
        thankYouTitle.style.fontWeight = 'bold';
        thankYouTitle.style.marginBottom = '16px';
        
        var thankYouMessage = document.createElement('p');
        thankYouMessage.textContent = formType === 'SMS' ? 
          'We\'ll send you a text message shortly.' : 
          'We\'ll review your case details and get back to you soon with an estimate.';
        thankYouMessage.style.fontSize = '16px';
        thankYouMessage.style.marginBottom = '20px';
        
        var closeThankYouButton = document.createElement('button');
        closeThankYouButton.textContent = 'Close';
        closeThankYouButton.style.padding = '10px 20px';
        closeThankYouButton.style.backgroundColor = '${primaryColor}';
        closeThankYouButton.style.color = 'white';
        closeThankYouButton.style.border = 'none';
        closeThankYouButton.style.borderRadius = '6px';
        closeThankYouButton.style.cursor = 'pointer';
        closeThankYouButton.addEventListener('click', function() {
          formModal.remove();
        });
        
        thankYou.appendChild(thankYouTitle);
        thankYou.appendChild(thankYouMessage);
        thankYou.appendChild(closeThankYouButton);
        
        formContainer.appendChild(thankYou);
        
        // Close modal after 5 seconds
        setTimeout(function() {
          formModal.remove();
        }, 5000);
      });
      
      formContainer.appendChild(closeButton);
      formContainer.appendChild(formTitle);
      formContainer.appendChild(form);
      
      formModal.appendChild(formContainer);
      
      return formModal;
    }
    
    // Create form input function
    function createFormInput(name, label, type, required) {
      var container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '4px';
      
      var labelElement = document.createElement('label');
      labelElement.htmlFor = name;
      labelElement.textContent = label + (required ? ' *' : '');
      labelElement.style.fontSize = '14px';
      labelElement.style.fontWeight = 'bold';
      
      var input = document.createElement('input');
      input.type = type;
      input.name = name;
      input.id = name;
      input.required = required;
      input.style.padding = '10px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
      
      container.appendChild(labelElement);
      container.appendChild(input);
      
      return container;
    }
    
    // Create textarea function
    function createFormTextarea(name, label) {
      var container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '4px';
      
      var labelElement = document.createElement('label');
      labelElement.htmlFor = name;
      labelElement.textContent = label;
      labelElement.style.fontSize = '14px';
      labelElement.style.fontWeight = 'bold';
      
      var textarea = document.createElement('textarea');
      textarea.name = name;
      textarea.id = name;
      textarea.rows = 4;
      textarea.style.padding = '10px';
      textarea.style.border = '1px solid #ccc';
      textarea.style.borderRadius = '4px';
      textarea.style.resize = 'vertical';
      
      container.appendChild(labelElement);
      container.appendChild(textarea);
      
      return container;
    }
    
    // Send data to CRM
    function sendToCRM(formData) {
      // Check if user has CRM integration settings in their account
      var webhookUrl = '${process.env.NEXT_PUBLIC_WEBHOOK_URL || ''}' || window.caseQueueSettings?.webhookUrl;
      
      if (!webhookUrl) {
        console.error('CRM webhook URL not configured');
        return;
      }
      
      // Send data to webhook
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error sending data to CRM:', error);
      });
    }
    
    // Add all buttons to buttons container
    buttonsContainer.appendChild(callButton);
    buttonsContainer.appendChild(smsButton);
    buttonsContainer.appendChild(whatsappButton);
    buttonsContainer.appendChild(valueButton);
    
    // Assemble modal
    modal.appendChild(companyTitle);
    modal.appendChild(buttonsContainer);
    
    // Assemble widget
    widget.appendChild(modal);
    widget.appendChild(widgetButton);
    
    // Add toggle functionality
    widgetButton.addEventListener('click', function() {
      if (modal.style.display === 'none') {
        modal.style.display = 'flex';
      } else {
        modal.style.display = 'none';
      }
    });
    
    // Add click outside to close
    document.addEventListener('click', function(event) {
      if (!widget.contains(event.target)) {
        modal.style.display = 'none';
      }
    });
    
    // Add widget to page
    document.body.appendChild(widget);
  })();
</script>
<!-- End CaseFlowPro Widget -->
    `.trim()
  }

  const scriptValue = generateScript()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Website Widget Generator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Widget Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={widgetSettings.companyName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Your Law Firm Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="companyPhone"
                value={widgetSettings.companyPhone}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="companyWhatsApp"
                value={widgetSettings.companyWhatsApp}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Position
              </label>
              <select
                name="position"
                value={widgetSettings.position}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="right">Bottom Right</option>
                <option value="left">Bottom Left</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  name="primaryColor"
                  value={widgetSettings.primaryColor}
                  onChange={handleInputChange}
                  className="h-10 w-10 border border-gray-300 rounded mr-2"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={widgetSettings.primaryColor}
                  onChange={handleInputChange}
                  className="input-field flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  name="secondaryColor"
                  value={widgetSettings.secondaryColor}
                  onChange={handleInputChange}
                  className="h-10 w-10 border border-gray-300 rounded mr-2"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={widgetSettings.secondaryColor}
                  onChange={handleInputChange}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>
          
          <h3 className="text-md font-medium mt-6 mb-3">Button Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Button Label
              </label>
              <input
                type="text"
                name="buttonLabels.call"
                value={widgetSettings.buttonLabels.call}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Button Label
              </label>
              <input
                type="text"
                name="buttonLabels.sms"
                value={widgetSettings.buttonLabels.sms}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Button Label
              </label>
              <input
                type="text"
                name="buttonLabels.whatsapp"
                value={widgetSettings.buttonLabels.whatsapp}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Value Button Label
              </label>
              <input
                type="text"
                name="buttonLabels.value"
                value={widgetSettings.buttonLabels.value}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Generated Widget Code</h2>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ClipboardIcon className="h-4 w-4 mr-1" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-gray-200 text-sm whitespace-pre-wrap">{scriptValue}</pre>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">To use this widget:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Copy the code above</li>
              <li>Paste it just before the closing <code className="bg-gray-100 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag of your website</li>
              <li>Make sure to configure your CRM integration in the settings page</li>
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 