import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChikitsakChat from '../ChikitsakChat';

// Mock the backend API client call
vi.mock('../../../services/apiClient', () => ({
  askChikitsakBackend: vi.fn().mockImplementation(async ({ userMessage }) => {
    if (userMessage.toLowerCase().includes('chest pain')) {
      return {
        id: 'msg-mock-emergency',
        sender: 'assistant',
        content: '🚨 URGENT EMERGENCY MEDICAL RED-FLAG: Please call 108 / 112 immediately.',
        isEmergency: true,
        citations: ['AIIMS Emergency Medicine Protocols'],
        explainability: {
          profileGrounding: 'Arjun Sharma (52y, Male)',
          safetyPolicy: 'Emergency Red-Flag Intercept'
        }
      };
    }
    return {
      id: 'msg-mock-1',
      sender: 'assistant',
      content: 'Here is your clinical guidance regarding your lab report parameters.',
      isEmergency: false,
      citations: ['ICMR Clinical Practice Guidelines'],
      explainability: {
        profileGrounding: 'Arjun Sharma (52y, Male)',
        safetyPolicy: 'ICMR Evidence Grounding'
      }
    };
  })
}));

describe('ChikitsakChat Component Integration', () => {
  const activeProfile = {
    id: 'user-arjun',
    name: 'Arjun Sharma',
    age: 52,
    gender: 'Male',
    bloodGroup: 'B+'
  };

  it('renders initial assistant greeting grounded in active profile', () => {
    render(<ChikitsakChat activeProfile={activeProfile} />);
    
    expect(screen.getByText(/I am Chikitsak AI/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Arjun Sharma/i).length).toBeGreaterThan(0);
  });

  it('renders suggested prompts and triggers chat response on click', async () => {
    render(<ChikitsakChat activeProfile={activeProfile} />);

    const ldlPrompt = screen.getByText(/What does elevated LDL mean\?/i);
    expect(ldlPrompt).toBeInTheDocument();

    fireEvent.click(ldlPrompt);

    await waitFor(() => {
      expect(screen.getByText(/clinical guidance regarding your lab report/i)).toBeInTheDocument();
    });
  });

  it('detects emergency queries and presents red-flag emergency alert', async () => {
    render(<ChikitsakChat activeProfile={activeProfile} />);

    const input = screen.getByPlaceholderText(/Ask Chikitsak about Arjun Sharma/i);
    fireEvent.change(input, { target: { value: 'I have severe sudden crushing chest pain' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/URGENT EMERGENCY/i)).toBeInTheDocument();
    });
  });
});
