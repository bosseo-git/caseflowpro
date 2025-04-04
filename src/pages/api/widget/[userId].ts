import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface for widget settings
interface WidgetSettings {
  theme?: string
  primaryColor?: string
  [key: string]: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers to allow embedding on any site
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Content-Type', 'application/javascript')
  
  const { userId } = req.query
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).end(`console.error("CaseFlowPro: Invalid user ID");`)
  }
  
  try {
    // Get the user and their widget settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        companyName: true,
        ghlSettings: true
      }
    })
    
    if (!user) {
      return res.status(404).end(`console.error("CaseFlowPro: User not found");`)
    }
    
    // Get the theme from settings
    const settings = user.ghlSettings as WidgetSettings || {}
    const theme = settings.theme || 'default'
    const primaryColor = settings.primaryColor || '#4F46E5'
    
    // Generate a simple widget code
    const widgetCode = `
      (function() {
        const container = document.createElement('div');
        container.id = 'caseflowpro-widget-container';
        
        const styles = document.createElement('style');
        styles.textContent = \`
          #caseflowpro-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: ${primaryColor};
            color: white;
            border-radius: 50px;
            padding: 12px 20px;
            font-family: system-ui, sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          #caseflowpro-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }
          #caseflowpro-iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            border: none;
            display: none;
          }
        \`;
        document.head.appendChild(styles);
        
        const button = document.createElement('div');
        button.id = 'caseflowpro-button';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>Contact Us';
        
        const iframe = document.createElement('iframe');
        iframe.id = 'caseflowpro-iframe';
        iframe.src = 'https://caseflowpro.vercel.app/widget/${userId}';
        
        container.appendChild(button);
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        button.addEventListener('click', function() {
          iframe.style.display = 'block';
        });
        
        window.addEventListener('message', function(event) {
          if (event.origin !== 'https://caseflowpro.vercel.app') return;
          if (event.data === 'caseflowpro:close') {
            iframe.style.display = 'none';
          }
        });
      })();
    `;
    
    return res.status(200).send(widgetCode)
  } catch (error) {
    console.error('Error generating widget:', error)
    return res.status(500).end(`console.error("CaseFlowPro: Server error");`)
  } finally {
    await prisma.$disconnect()
  }
} 