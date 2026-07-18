import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { createMedicine } from "@/lib/medicines/create-medicine";
import { listMedicines } from "@/lib/medicines/list-medicines";
import { createMedicineSchema, listMedicinesQuerySchema } from "@/lib/validators/medicine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createMedicineSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return ApiResponse.error(message, 400);
    }

    const createdMedicine = await createMedicine(parsed.data);
    return ApiResponse.success(createdMedicine, 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return ApiResponse.error("Invalid JSON body", 400);
    }

    if (error instanceof Error && error.message === "Medicine already exists") {
      return ApiResponse.error(error.message, 409);
    }

    return error instanceof Error
      ? ApiResponse.error(error.message, 500)
      : ApiResponse.error("Internal server error", 500);
  }
}



export async function GET(request: NextRequest) {


  try {

    const searchParams = request.nextUrl.searchParams;

    const parsed = listMedicinesQuerySchema.safeParse({ search: searchParams.get("search") ?? undefined });

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return ApiResponse.error(message, 400);
    }

    const medicines = await listMedicines(parsed.data);

    return ApiResponse.success(medicines, 200);

  } catch (error) {
    return error instanceof Error
      ? ApiResponse.error(error.message, 500)
      : ApiResponse.error("Internal server error", 500);

  }
}
