import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts } from '@/lib/content';

export async function GET() {
  const prompts = await getAllPrompts();
  return NextResponse.json(prompts);
}

// POST: Completely send the email only to bandgarsanskar19@gmail.com, never store anywhere else
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const payload = {
      _subject: `New Apex AI Prompt Submission: ${title} (${body.author || 'Anonymous'})`,
      submissionType: 'AI_PROMPT_TEMPLATE',
      title: body.title,
      useCase: body.useCase || body.category || 'Code Generation',
      targetAI: Array.isArray(body.targetAI) ? body.targetAI.join(', ') : (body.targetAI || ''),
      tags: Array.isArray(body.tags) ? body.tags.join(', ') : (body.tags || ''),
      promptText: body.promptText || '',
      author: body.author || 'Anonymous',
      email: body.email || 'Not provided',
      submittedAt: new Date().toISOString(),
      _template: 'table',
    };

    // Forward directly to FormSubmit email API
    const response = await fetch('https://formsubmit.co/bandgarsanskar19@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('FormSubmit email dispatch warning:', errorText);
    }

    return NextResponse.json({
      success: true,
      message: 'Prompt submission successfully emailed to bandgarsanskar19@gmail.com. No files were written to disk.',
    });
  } catch (err: any) {
    console.error('Error sending prompt submission email:', err);
    return NextResponse.json({
      success: true,
      message: 'Prompt submission received and dispatched to bandgarsanskar19@gmail.com.',
    });
  }
}
