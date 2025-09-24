// Client-side Gmail API service using fetch instead of googleapis library

export interface GmailEmail {
  id: string
  threadId: string
  sender: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  preview: string
  timestamp: Date
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
  isImportant: boolean
  body?: string
  labels: string[]
}

export class GmailService {
  private accessToken: string
  private baseUrl = 'https://gmail.googleapis.com/gmail/v1'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    console.log(`Making Gmail API request to: ${endpoint}`)
    
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log(`Gmail API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gmail API error details:`, errorText)
      throw new Error(`Gmail API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    // Handle empty responses (like DELETE operations)
    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      return null
    }

    try {
      return JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse JSON response:', responseText)
      throw new Error('Invalid JSON response from Gmail API')
    }
  }

  async getEmails(maxResults: number = 50, query?: string): Promise<GmailEmail[]> {
    try {
      console.log(`Fetching emails with maxResults: ${maxResults}, query: ${query || 'in:inbox'}`)
      
      const response = await this.makeRequest(
        `/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query || 'in:inbox')}`
      )

      console.log('Gmail messages list response:', response)

      if (!response.messages) {
        console.log('No messages found in response')
        return []
      }

      console.log(`Found ${response.messages.length} messages, fetching details...`)

      const emails = await Promise.all(
        response.messages.map(async (message: any, index: number) => {
          try {
            console.log(`Fetching email ${index + 1}/${response.messages.length}: ${message.id}`)
            const emailData = await this.makeRequest(`/users/me/messages/${message.id}?format=full`)
            const parsedEmail = this.parseEmailData(emailData)
            console.log(`Successfully parsed email ${index + 1}: ${parsedEmail.subject}`)
            return parsedEmail
          } catch (error) {
            console.error(`Error fetching email ${message.id}:`, error)
            throw error
          }
        })
      )

      console.log(`Successfully fetched ${emails.length} emails`)
      return emails
    } catch (error) {
      console.error('Error in getEmails:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to fetch emails: ${error.message}`)
      }
      throw new Error('Failed to fetch emails: Unknown error')
    }
  }

  async deleteEmail(emailId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/me/messages/${emailId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting email:', error)
      throw error
    }
  }

  async deleteEmails(emailIds: string[]): Promise<void> {
    try {
      await Promise.all(emailIds.map(id => this.deleteEmail(id)))
    } catch (error) {
      console.error('Error deleting emails:', error)
      throw error
    }
  }

  async markAsRead(emailId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/me/messages/${emailId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          removeLabelIds: ['UNREAD']
        })
      })
    } catch (error) {
      console.error('Error marking email as read:', error)
      throw error
    }
  }

  async starEmail(emailId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/me/messages/${emailId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          addLabelIds: ['STARRED']
        })
      })
    } catch (error) {
      console.error('Error starring email:', error)
      throw error
    }
  }

  async markAsStarred(emailId: string): Promise<void> {
    return this.starEmail(emailId)
  }

  async archiveEmail(emailId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/me/messages/${emailId}/modify`, {
        method: 'POST',
        body: JSON.stringify({
          removeLabelIds: ['INBOX']
        })
      })
    } catch (error) {
      console.error('Error archiving email:', error)
      throw error
    }
  }

  private parseEmailData(emailData: any): GmailEmail {
    const headers = emailData.payload.headers
    const getHeader = (name: string) => 
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

    const fromHeader = getHeader('from')
    const senderMatch = fromHeader.match(/^(.*?)\s*<(.+)>$/) || [null, fromHeader, fromHeader]
    const senderName = senderMatch[1]?.trim().replace(/"/g, '') || senderMatch[2]
    const senderEmail = senderMatch[2] || fromHeader

    // Extract email body
    let body = ''
    if (emailData.payload.body?.data) {
      body = Buffer.from(emailData.payload.body.data, 'base64').toString('utf-8')
    } else if (emailData.payload.parts) {
      const textPart = emailData.payload.parts.find((part: any) => 
        part.mimeType === 'text/plain' || part.mimeType === 'text/html'
      )
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
      }
    }

    // Create preview from body (first 150 characters)
    const preview = body
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 150)

    return {
      id: emailData.id,
      threadId: emailData.threadId,
      sender: {
        name: senderName,
        email: senderEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=random`,
      },
      subject: getHeader('subject'),
      preview: preview + (preview.length === 150 ? '...' : ''),
      timestamp: new Date(parseInt(emailData.internalDate)),
      isRead: !emailData.labelIds?.includes('UNREAD'),
      isStarred: emailData.labelIds?.includes('STARRED') || false,
      hasAttachment: emailData.payload.parts?.some((part: any) => 
        part.filename && part.filename.length > 0
      ) || false,
      isImportant: emailData.labelIds?.includes('IMPORTANT') || false,
      body,
      labels: emailData.labelIds || [],
    }
  }
}