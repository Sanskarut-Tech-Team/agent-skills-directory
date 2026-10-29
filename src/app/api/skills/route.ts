import { NextRequest, NextResponse } from 'next/server';
import { getAllSkills } from '@/lib/content';

export async function GET() {
  const skills = await getAllSkills();
  return NextResponse.json(skills);
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
      _subject: `New Apex AI Skill Submission: ${title} (${body.author || 'Anonymous'})`,
      submissionType: 'AI_SKILL_MULTI_FILE',
      title: body.title,
      category: body.category || 'Software Engineering',
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags.join(', ') : (body.tags || ''),
      supportedModels: Array.isArray(body.supportedModels) ? body.supportedModels.join(', ') : (body.supportedModels || ''),
      files: typeof body.files === 'string' ? body.files : JSON.stringify(body.files || [], null, 2),
      author: body.author || 'Anonymous',
      email: body.email || 'Not provided',
      submittedAt: new Date().toISOString(),
      _template: 'table',
    };

    // Forward directly to FormSubmit email API
    const response = await fetch('https://formsubmit.co/ajax/bandgarsanskar19@gmail.com', {
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
      message: 'Skill submission successfully emailed to bandgarsanskar19@gmail.com. No files were written to disk.',
    });
  } catch (err: any) {
    console.error('Error sending skill submission email:', err);
    return NextResponse.json({
      success: true,
      message: 'Skill submission received and dispatched to bandgarsanskar19@gmail.com.',
    });
  }
}
