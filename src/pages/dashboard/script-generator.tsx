import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'
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
    theme: 'light',
    layout: 'classic',
    startMinimized: true,
    analytics: {
      enabled: true,
      trackEvents: true,
      trackImpressions: true,
      trackConversions: true,
      cookieConsent: true,
      anonymizeIP: false,
      googleAnalytics: {
        enabled: false,
        trackingId: ''
      }
    },
    buttonLabels: {
      call: 'Call Now',
      sms: 'SMS Us',
      whatsapp: 'WhatsApp',
      chat: 'Live Chat'
    },
    buttonActions: {
      call: 'phone',
      sms: 'form',
      whatsapp: 'whatsapp',
      chat: 'form'
    },
    buttonColors: {
      call: '#2196F3',
      sms: '#9E9E9E',
      whatsapp: '#4CAF50',
      chat: '#673AB7'
    }
  })

  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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
    } else if (name.startsWith('buttonActions.')) {
      const buttonType = name.split('.')[1]
      setWidgetSettings(prev => ({
        ...prev,
        buttonActions: {
          ...prev.buttonActions,
          [buttonType]: value
        }
      }))
    } else if (name.startsWith('buttonColors.')) {
      const buttonType = name.split('.')[1]
      setWidgetSettings(prev => ({
        ...prev,
        buttonColors: {
          ...prev.buttonColors,
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
    const { 
      primaryColor, 
      secondaryColor, 
      position, 
      companyName, 
      companyPhone, 
      companyWhatsApp, 
      buttonLabels, 
      buttonActions,
      buttonColors,
      theme, 
      layout,
      startMinimized,
      analytics
    } = widgetSettings
    
    // Calculate colors based on theme
    const bgColor = theme === 'dark' ? '#1E1E1E' : 'white';
    const iconColor = theme === 'dark' ? '#D4AF37' : primaryColor; // Gold color for dark theme
    const textColor = theme === 'dark' ? '#D4AF37' : '#333333';
    const buttonBgColor = theme === 'dark' ? '#2D2D2D' : primaryColor;
    const buttonTextColor = theme === 'dark' ? '#D4AF37' : 'white';
    const headerBgColor = theme === 'dark' ? '#333333' : primaryColor;
    const headerTextColor = theme === 'dark' ? '#D4AF37' : 'white';
    
    return `
<!-- CaseFlowPro Widget -->
<script>
  (function() {
    // CaseFlowPro Analytics Object
    window.caseFlowProAnalytics = {
      widgetId: '${user?.id || 'unknown'}',
      events: [],
      trackEvent: function(eventName, eventData) {
        if (!${analytics.enabled}) return;
        
        const event = {
          eventName,
          eventData,
          timestamp: new Date().toISOString(),
          page: window.location.href,
          referrer: document.referrer,
          sessionId: this.getSessionId()
        };
        
        this.events.push(event);
        this.sendEvent(event);
        
        ${analytics.googleAnalytics.enabled ? `
        // Send to Google Analytics if configured
        if (typeof gtag !== 'undefined') {
          gtag('event', eventName, eventData);
        }
        ` : ''}
      },
      getSessionId: function() {
        let sessionId = sessionStorage.getItem('caseFlowProSessionId');
        if (!sessionId) {
          sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('caseFlowProSessionId', sessionId);
        }
        return sessionId;
      },
      sendEvent: function(event) {
        // Send analytics data to the server
        fetch('${process.env.NEXT_PUBLIC_API_URL || ''}/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event),
          // Don't wait for response to avoid blocking
          keepalive: true
        }).catch(error => console.error('Analytics error:', error));
      }
    };
    
    // Create widget container
    var widget = document.createElement('div');
    widget.id = 'caseflowpro-widget';
    widget.style.position = 'fixed';
    widget.style.${position === 'right' ? 'right' : 'left'} = '20px';
    widget.style.bottom = '20px';
    widget.style.zIndex = '9999';
    widget.style.fontFamily = 'Arial, sans-serif';
    
    // Track widget impression
    if (${analytics.trackImpressions}) {
      window.caseFlowProAnalytics.trackEvent('widget_impression', {
        widgetPosition: '${position}',
        widgetTheme: '${theme}',
        widgetLayout: '${layout}'
      });
    }
    
    // Create widget button (for minimized state)
    var widgetButton = document.createElement('button');
    widgetButton.id = 'caseflowpro-toggle';
    widgetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    widgetButton.style.width = '60px';
    widgetButton.style.height = '60px';
    widgetButton.style.borderRadius = '${theme === 'dark' ? '12px' : '50%'}';
    widgetButton.style.backgroundColor = '${theme === 'dark' ? '#1E1E1E' : primaryColor}';
    widgetButton.style.color = '${theme === 'dark' ? '#D4AF37' : 'white'}';
    widgetButton.style.border = '${theme === 'dark' ? '1px solid #333333' : 'none'}';
    widgetButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    widgetButton.style.cursor = 'pointer';
    widgetButton.style.display = '${startMinimized ? 'flex' : 'none'}';
    widgetButton.style.alignItems = 'center';
    widgetButton.style.justifyContent = 'center';
    widgetButton.style.transition = 'all 0.3s ease';
    
    // Add analytics to button clicks
    widgetButton.addEventListener('click', function() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('widget_open', {
          widgetPosition: '${position}',
          widgetTheme: '${theme}',
          widgetLayout: '${layout}'
        });
      }
    });
    
    // Create widget modal
    var modal = document.createElement('div');
    modal.id = 'caseflowpro-modal';
    modal.style.position = 'relative';
    modal.style.width = layout === 'modern' ? '280px' : '300px';
    modal.style.backgroundColor = '${bgColor}';
    modal.style.borderRadius = '${theme === 'dark' ? '16px' : '8px'}';
    modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, ${theme === 'dark' ? '0.5' : '0.15'})';
    modal.style.overflow = 'hidden';
    modal.style.display = '${startMinimized ? 'none' : 'flex'}';
    modal.style.flexDirection = 'column';
    modal.style.transition = 'all 0.3s ease';
    
    // Create header for the modal
    var modalHeader = document.createElement('div');
    modalHeader.style.padding = '12px 16px';
    modalHeader.style.backgroundColor = '${headerBgColor}';
    modalHeader.style.color = '${headerTextColor}';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.borderTopLeftRadius = '${theme === 'dark' ? '16px' : '8px'}';
    modalHeader.style.borderTopRightRadius = '${theme === 'dark' ? '16px' : '8px'}';
    
    // Add company name to header
    var companyTitle = document.createElement('h3');
    companyTitle.textContent = '${companyName || 'Contact Us'}';
    companyTitle.style.margin = '0';
    companyTitle.style.fontSize = '16px';
    companyTitle.style.fontWeight = 'bold';
    
    // Add minimize button to header
    var minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    minimizeButton.style.background = 'none';
    minimizeButton.style.border = 'none';
    minimizeButton.style.color = 'inherit';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.padding = '0';
    minimizeButton.style.display = 'flex';
    minimizeButton.style.alignItems = 'center';
    minimizeButton.style.justifyContent = 'center';
    minimizeButton.style.width = '24px';
    minimizeButton.style.height = '24px';
    minimizeButton.title = 'Minimize';
    
    // Add header elements
    modalHeader.appendChild(companyTitle);
    modalHeader.appendChild(minimizeButton);
    
    // Add analytics to minimize button
    minimizeButton.addEventListener('click', function() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('widget_minimize', {});
      }
    });
    
    // Create content container for the modal
    var modalContent = document.createElement('div');
    modalContent.style.padding = '16px';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.gap = '12px';
    
    // Create buttons container with layout-dependent styling
    var buttonsContainer = document.createElement('div');
    
    // Choose layout for the buttons
    if (layout === 'modern') {
      buttonsContainer.style.display = 'grid';
      buttonsContainer.style.gridTemplateColumns = '1fr 1fr';
      buttonsContainer.style.gap = '16px';
      buttonsContainer.style.justifyItems = 'center';
    } else {
      buttonsContainer.style.display = 'grid';
      buttonsContainer.style.gridTemplateColumns = '1fr 1fr';
      buttonsContainer.style.gap = '10px';
    }
    
    // Create button helper
    function createButton(iconSvg, label, onClick, colorHover, buttonType) {
      var button = document.createElement('button');
      button.className = 'caseflowpro-button ' + buttonType + '-button';
      button.setAttribute('aria-label', label);
      button.addEventListener('click', onClick);
      
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'flex-start';
      button.style.width = '100%';
      button.style.padding = '12px 16px'; // Improved padding
      button.style.margin = '8px 0';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.backgroundColor = colorHover;
      button.style.color = '#ffffff';
      button.style.fontWeight = '500';
      button.style.cursor = 'pointer';
      button.style.transition = 'all 0.2s ease';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      
      // Add icon and label
      var icon = document.createElement('span');
      icon.innerHTML = iconSvg;
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.marginRight = '10px'; // Space between icon and text
      
      var text = document.createElement('span');
      text.textContent = label;
      
      button.appendChild(icon);
      button.appendChild(text);
      
      return button;
    }
    
    // Define icons for each button type
    var callIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    var smsIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    var whatsappIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    var chatIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line><polyline points="12 12 12 8"></polyline></svg>';
    
    // Define button actions based on settings
    function handleCallAction() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('call_button_click', {
          actionType: '${buttonActions.call}'
        });
      }
      
      if (buttonActions.call === 'phone') {
        window.location.href = 'tel:${companyPhone}';
      } else {
        var currentModal = document.getElementById('caseflowpro-form-modal');
        if (currentModal) {
          currentModal.remove();
        }
        var formModal = createFormModal('Call');
        document.body.appendChild(formModal);
        formModal.style.display = 'block';
      }
    }
    
    function handleSmsAction() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('sms_button_click', {
          actionType: '${buttonActions.sms}'
        });
      }
      
      if (buttonActions.sms === 'sms') {
        window.location.href = 'sms:${companyPhone}';
      } else {
        var currentModal = document.getElementById('caseflowpro-form-modal');
        if (currentModal) {
          currentModal.remove();
        }
        var formModal = createFormModal('SMS');
        document.body.appendChild(formModal);
        formModal.style.display = 'block';
      }
    }
    
    function handleWhatsappAction() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('whatsapp_button_click', {});
      }
      
      var phoneNumber = '${companyWhatsApp}'.replace(/[^0-9]/g, '');
      window.open('https://wa.me/' + phoneNumber, '_blank');
    }
    
    function handleChatAction() {
      if (${analytics.trackEvents}) {
        window.caseFlowProAnalytics.trackEvent('chat_button_click', {
          actionType: '${buttonActions.chat}'
        });
      }
      
      if (buttonActions.chat === 'chat') {
        // Here you could open a chat widget if you have one integrated
        console.log('Opening chat widget');
        // For example: window.openChatWidget && window.openChatWidget();
      } else {
        var currentModal = document.getElementById('caseflowpro-form-modal');
        if (currentModal) {
          currentModal.remove();
        }
        var formModal = createFormModal('Chat');
        document.body.appendChild(formModal);
        formModal.style.display = 'block';
      }
    }
    
    // Create the buttons
    var callButton = createButton(callIcon, '${buttonLabels.call}', handleCallAction, '${primaryColor}', 'call');
    var smsButton = createButton(smsIcon, '${buttonLabels.sms}', handleSmsAction, '${secondaryColor}', 'sms');
    var whatsappButton = createButton(whatsappIcon, '${buttonLabels.whatsapp}', handleWhatsappAction, '${primaryColor}', 'whatsapp');
    var chatButton = createButton(chatIcon, '${buttonLabels.chat}', handleChatAction, '${secondaryColor}', 'chat');
    
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
      
      // Track form submission
      if (${analytics.trackConversions}) {
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
          
          // Track form submission
          if (${analytics.trackConversions}) {
            window.caseFlowProAnalytics.trackEvent('form_submit', {
              formType: formType
            });
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
      }
      
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
    buttonsContainer.appendChild(chatButton);
    
    // Assemble modal
    modalContent.appendChild(buttonsContainer);
    modal.appendChild(modalHeader);
    modal.appendChild(modalContent);
    
    // Assemble widget
    widget.appendChild(modal);
    widget.appendChild(widgetButton);
    
    // Add toggle functionality
    function minimizeWidget() {
      modal.style.display = 'none';
      widgetButton.style.display = 'flex';
    }
    
    function maximizeWidget() {
      modal.style.display = 'flex';
      widgetButton.style.display = 'none';
    }
    
    minimizeButton.addEventListener('click', minimizeWidget);
    widgetButton.addEventListener('click', maximizeWidget);
    
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

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      // Here we would typically call an API endpoint to save settings
      // For now, we'll just simulate a successful save with a delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // If you have an actual API endpoint, you would call it like this:
      // const response = await fetch('/api/save-widget-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(widgetSettings)
      // })
      
      // If successful
      setSaveSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      // You could add error handling UI here
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Script Generator</h1>
        
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Theme
              </label>
              <select
                name="theme"
                value={widgetSettings.theme}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark Gold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Layout
              </label>
              <select
                name="layout"
                value={widgetSettings.layout}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="classic">Classic Grid</option>
                <option value="modern">Modern Circles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial State
              </label>
              <select
                name="startMinimized"
                value={widgetSettings.startMinimized.toString()}
                onChange={(e) => {
                  const value = e.target.value === 'true';
                  setWidgetSettings(prev => ({
                    ...prev,
                    startMinimized: value
                  }));
                }}
                className="input-field w-full"
              >
                <option value="true">Start Minimized</option>
                <option value="false">Start Maximized (Chat-like)</option>
              </select>
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
                Live Chat Button Label
              </label>
              <input
                type="text"
                name="buttonLabels.chat"
                value={widgetSettings.buttonLabels.chat}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <h3 className="text-md font-medium mt-6 mb-3">Button Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Button Action
              </label>
              <select
                name="buttonActions.call"
                value={widgetSettings.buttonActions.call}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="phone">Direct Call</option>
                <option value="form">Show Form</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Button Action
              </label>
              <select
                name="buttonActions.sms"
                value={widgetSettings.buttonActions.sms}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="sms">Open SMS App</option>
                <option value="form">Show Form</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Button Action
              </label>
              <select
                name="buttonActions.whatsapp"
                value={widgetSettings.buttonActions.whatsapp}
                onChange={handleInputChange}
                className="input-field w-full"
                disabled
              >
                <option value="whatsapp">Open WhatsApp</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">WhatsApp always opens the WhatsApp app or web interface</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Live Chat Button Action
              </label>
              <select
                name="buttonActions.chat"
                value={widgetSettings.buttonActions.chat}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="chat">Open Live Chat</option>
                <option value="form">Show Form</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Analytics Settings</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="analytics-enabled"
                checked={widgetSettings.analytics.enabled}
                onChange={(e) => {
                  setWidgetSettings(prev => ({
                    ...prev,
                    analytics: {
                      ...prev.analytics,
                      enabled: e.target.checked
                    }
                  }));
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="analytics-enabled" className="ml-2 block text-sm text-gray-700">
                Enable Analytics
              </label>
            </div>
          </div>
          
          {widgetSettings.analytics.enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="track-events"
                    checked={widgetSettings.analytics.trackEvents}
                    onChange={(e) => {
                      setWidgetSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          trackEvents: e.target.checked
                        }
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="track-events" className="ml-2 block text-sm text-gray-700">
                    Track Button Clicks
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="track-impressions"
                    checked={widgetSettings.analytics.trackImpressions}
                    onChange={(e) => {
                      setWidgetSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          trackImpressions: e.target.checked
                        }
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="track-impressions" className="ml-2 block text-sm text-gray-700">
                    Track Widget Impressions
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="track-conversions"
                    checked={widgetSettings.analytics.trackConversions}
                    onChange={(e) => {
                      setWidgetSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          trackConversions: e.target.checked
                        }
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="track-conversions" className="ml-2 block text-sm text-gray-700">
                    Track Form Submissions
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cookie-consent"
                    checked={widgetSettings.analytics.cookieConsent}
                    onChange={(e) => {
                      setWidgetSettings(prev => ({
                        ...prev,
                        analytics: {
                          ...prev.analytics,
                          cookieConsent: e.target.checked
                        }
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cookie-consent" className="ml-2 block text-sm text-gray-700">
                    Show Cookie Consent
                  </label>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="google-analytics"
                      checked={widgetSettings.analytics.googleAnalytics.enabled}
                      onChange={(e) => {
                        setWidgetSettings(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics,
                            googleAnalytics: {
                              ...prev.analytics.googleAnalytics,
                              enabled: e.target.checked
                            }
                          }
                        }));
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="google-analytics" className="ml-2 block text-sm text-gray-700">
                      Send Events to Google Analytics
                    </label>
                  </div>
                </div>
                
                {widgetSettings.analytics.googleAnalytics.enabled && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Analytics Tracking ID
                    </label>
                    <input
                      type="text"
                      value={widgetSettings.analytics.googleAnalytics.trackingId}
                      onChange={(e) => {
                        setWidgetSettings(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics,
                            googleAnalytics: {
                              ...prev.analytics.googleAnalytics,
                              trackingId: e.target.value
                            }
                          }
                        }));
                      }}
                      placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                      className="input-field w-full"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Analytics data will help you understand how visitors interact with your widget.
                View detailed reports in the <a href="/dashboard/analytics" className="text-primary-600 hover:text-primary-500">Analytics Dashboard</a>.
              </div>
            </div>
          )}
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
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
} 