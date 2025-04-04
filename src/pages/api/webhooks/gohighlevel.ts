import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    // Get the webhook data from the request body
    const webhookData = req.body
    
    // Extract the necessary information based on the event type
    // GoHighLevel webhook events can vary based on your configuration
    
    // Log the webhook event for debugging
    console.log('GoHighLevel Webhook Event:', JSON.stringify(webhookData, null, 2))
    
    // Example: Handle contact created or updated event
    if (webhookData.event === 'contact_created' || webhookData.event === 'contact_updated') {
      const contactData = webhookData.contact
      
      // Process the contact data as needed
      // This could involve updating your database, sending notifications, etc.
      
      // Example: Log lead information
      console.log(`New lead received: ${contactData.name} (${contactData.email})`)
      
      // You could store the lead in your database if needed
      
      return res.status(200).json({ success: true, message: 'Contact processed successfully' })
    }
    
    // Example: Handle form submission event
    if (webhookData.event === 'form_submitted') {
      const formData = webhookData.formData
      const contactData = webhookData.contact
      
      // Process the form submission
      console.log(`Form submitted by ${contactData.name}: ${formData.formName}`)
      
      return res.status(200).json({ success: true, message: 'Form submission processed successfully' })
    }
    
    // Example: Handle message received event
    if (webhookData.event === 'message_received') {
      const messageData = webhookData.message
      const contactData = webhookData.contact
      
      // Process the incoming message
      console.log(`Message received from ${contactData.name}: ${messageData.body}`)
      
      return res.status(200).json({ success: true, message: 'Message processed successfully' })
    }
    
    // For any other events, just acknowledge receipt
    return res.status(200).json({ success: true, message: 'Webhook received' })
    
  } catch (error) {
    console.error('Error processing GoHighLevel webhook:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
} 