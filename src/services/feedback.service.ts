import api from './api'

export interface CreateFeedbackRequest {
  type: 'bug' | 'feature' | 'general'
  title: string
  description: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  user_agent?: string
  url?: string
}

export interface FeedbackResponse {
  id: string
  type: string
  title: string
  description: string
  priority: string
  status: string
  user_agent?: string
  url?: string
  admin_notes?: string
  created_at: string
  user_id?: string
}

export interface UpdateFeedbackStatusRequest {
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  admin_notes?: string
}

export interface FeedbackFilters {
  type?: string
  status?: string
  priority?: string
  user_id?: string
  limit?: number
  offset?: number
}

export class FeedbackService {
  /**
   * Create a new feedback submission
   */
  static async createFeedback(data: CreateFeedbackRequest): Promise<FeedbackResponse> {
    const response = await api.post<FeedbackResponse>('/feedback', data)
    return response.data
  }

  /**
   * List all feedback (admin only)
   */
  static async listFeedback(filters?: FeedbackFilters): Promise<FeedbackResponse[]> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.user_id) params.append('user_id', filters.user_id)
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.offset) params.append('offset', filters.offset.toString())
    }

    const queryString = params.toString()
    const url = queryString ? `/feedback?${queryString}` : '/feedback'
    
    const response = await api.get<FeedbackResponse[]>(url)
    return response.data
  }

  /**
   * Get a specific feedback item (admin only)
   */
  static async getFeedback(id: string): Promise<FeedbackResponse> {
    const response = await api.get<FeedbackResponse>(`/feedback/${id}`)
    return response.data
  }

  /**
   * Update feedback status (admin only)
   */
  static async updateFeedbackStatus(
    id: string, 
    data: UpdateFeedbackStatusRequest
  ): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/feedback/${id}/status`, data)
    return response.data
  }
}