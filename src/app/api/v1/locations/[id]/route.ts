import { NextRequest, NextResponse } from "next/server";
import { locationRepository } from "@/modules/locations/repositories/location.repository";
import logger from "@/lib/logger";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, props: { params: Params }) {
  try {
    const { id } = await props.params;
    const location = await locationRepository.findById(id);
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    return NextResponse.json({ data: location });
  } catch (error) {
    logger.error({ error }, "Error fetching location");
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}
