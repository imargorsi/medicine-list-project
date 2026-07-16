import { NextResponse } from "next/server";

export const ApiResponse = {
  success<T>(data: T | null = null, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
  },

  error(message: string, status = 400) {
    return NextResponse.json(
      {
        success: false,
        error: { message },
      },
      { status },
    );
  },
};
