import { NextRequest, NextResponse } from "next/server";
import { locationRepository } from "@/modules/locations/repositories/location.repository";
import { createLocationService } from "@/modules/locations/services/create-location.service";
import { createLocationSchema } from "@/modules/locations/validators/create-location.schema";
import { auth } from "@/server/auth";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const province = searchParams.get("province");

    let locations;
    if (city) {
      locations = await locationRepository.findByCity(city);
    } else if (province) {
      locations = await locationRepository.findByProvince(province);
    } else {
      locations = await locationRepository.findAll(undefined, { orderBy: { createdAt: "desc" } });
    }

    return NextResponse.json({ data: locations });
  } catch (error) {
    logger.error({ error }, "Error fetching locations");
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can create locations
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createLocationSchema.parse(body);
    const location = await createLocationService.execute(validated);
    return NextResponse.json({ data: location }, { status: 201 });
  } catch (error: any) {
    logger.error({ error }, "Error creating location");
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
