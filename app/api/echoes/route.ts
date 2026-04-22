import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data/echoes.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return empty array if file doesn't exist or error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const echoes = await request.json();
    await fs.writeFile(filePath, JSON.stringify(echoes, null, 2));
    return NextResponse.json({ success: true, message: 'Mycelium saved to data/echoes.json' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save' }, { status: 500 });
  }
}
