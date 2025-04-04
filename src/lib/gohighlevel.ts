/**
 * GoHighLevel API Integration Utilities
 * 
 * This file contains helper functions for interacting with the GoHighLevel API.
 * Documentation: https://developers.gohighlevel.com/
 */

const GHL_API_BASE_URL = 'https://rest.gohighlevel.com/v1';

interface GHLContactInfo {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  dateOfBirth?: string;
  tags?: string[];
  customFields?: { [key: string]: string };
}

interface GHLTaskInfo {
  title: string;
  description?: string;
  dueDate?: string; // ISO format date
  status?: 'Todo' | 'In Progress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  assignedTo?: string[]; // User IDs
}

interface GHLNoteInfo {
  title: string;
  body: string;
}

/**
 * Create or update a contact in GoHighLevel
 */
export async function createContact(
  locationId: string,
  apiKey: string,
  contactInfo: GHLContactInfo
): Promise<any> {
  try {
    const response = await fetch(`${GHL_API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Location': locationId,
      },
      body: JSON.stringify(contactInfo),
    });

    if (!response.ok) {
      throw new Error(`Failed to create contact: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating contact in GoHighLevel:', error);
    throw error;
  }
}

/**
 * Create a task for a contact in GoHighLevel
 */
export async function createTask(
  locationId: string,
  apiKey: string,
  contactId: string,
  taskInfo: GHLTaskInfo
): Promise<any> {
  try {
    const response = await fetch(`${GHL_API_BASE_URL}/contacts/${contactId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Location': locationId,
      },
      body: JSON.stringify(taskInfo),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task in GoHighLevel:', error);
    throw error;
  }
}

/**
 * Add a note to a contact in GoHighLevel
 */
export async function addNote(
  locationId: string,
  apiKey: string,
  contactId: string,
  noteInfo: GHLNoteInfo
): Promise<any> {
  try {
    const response = await fetch(`${GHL_API_BASE_URL}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Location': locationId,
      },
      body: JSON.stringify(noteInfo),
    });

    if (!response.ok) {
      throw new Error(`Failed to add note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding note in GoHighLevel:', error);
    throw error;
  }
}

/**
 * Send an SMS message to a contact in GoHighLevel
 */
export async function sendSMS(
  locationId: string,
  apiKey: string,
  contactId: string,
  message: string
): Promise<any> {
  try {
    const response = await fetch(`${GHL_API_BASE_URL}/contacts/${contactId}/sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Location': locationId,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send SMS: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending SMS in GoHighLevel:', error);
    throw error;
  }
}

/**
 * Process form data and add it to GoHighLevel
 */
export async function processFormSubmission(
  locationId: string,
  apiKey: string,
  formData: any,
  formType: 'SMS' | 'Case Value'
): Promise<any> {
  try {
    // First, create or update the contact
    const contactInfo: GHLContactInfo = {
      name: formData.name,
      phone: formData.phone,
      tags: [formType]
    };

    // Add custom fields based on form type
    if (formType === 'Case Value') {
      contactInfo.customFields = {
        case_type: formData.caseType || '',
        case_details: formData.caseDetails || '',
      };
    }

    // Create the contact
    const contactResponse = await createContact(locationId, apiKey, contactInfo);
    const contactId = contactResponse.id;

    // Add a note with the form details
    const noteTitle = formType === 'SMS' ? 'SMS Contact Request' : 'Case Value Request';
    let noteBody = `${formData.name} submitted a ${formType} form.`;
    
    if (formType === 'Case Value') {
      noteBody += `\n\nCase Type: ${formData.caseType || 'Not specified'}`;
      noteBody += `\n\nCase Details: ${formData.caseDetails || 'Not provided'}`;
    }

    await addNote(locationId, apiKey, contactId, {
      title: noteTitle,
      body: noteBody
    });

    // Create a task for follow-up
    const taskTitle = formType === 'SMS' ? 'Follow up on SMS contact' : 'Provide case value estimate';
    await createTask(locationId, apiKey, contactId, {
      title: taskTitle,
      description: `Contact ${formData.name} at ${formData.phone} regarding their ${formType} submission`,
      priority: 'Medium',
      status: 'Todo',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Due tomorrow
    });

    return {
      success: true,
      contactId,
      message: 'Form submission processed successfully'
    };
  } catch (error) {
    console.error('Error processing form submission:', error);
    throw error;
  }
} 