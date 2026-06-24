import { NextRequest, NextResponse } from "next/server";
import { agencyRepository } from "@/modules/agencies/repositories/agency.repository";
import logger from "@/lib/logger";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, props: { params: Params }) {
  try {
    const { id } = await props.params;
    const agency = await agencyRepository.findById(id);
    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }
    return NextResponse.json({ data: agency });
  } catch (error) {
    logger.error({ error }, "Error fetching agency");
    return NextResponse.json({ error: "Failed to fetch agency" }, { status: 500 });
  }
}
