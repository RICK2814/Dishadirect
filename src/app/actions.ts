"use server";

import {
  careerPathRecommendations,
  type CareerPathRecommendationsInput,
} from "@/ai/flows/career-path-recommendations";
import {
  getJobMarketTrends,
  type JobMarketTrendsInput,
} from "@/ai/flows/job-market-trends";
import {
  analyzeSkillsGap,
  type SkillsGapAnalysisInput,
} from "@/ai/flows/skills-gap-analysis";
import {
  getSkillsRecommendation,
  type SkillsRecommendationInput,
} from "@/ai/flows/skills-recommendation";
import {
  getInterviewPrep,
  type InterviewPrepInput,
} from "@/ai/flows/interview-prep";

export async function getCareerPathRecommendations(
  input: CareerPathRecommendationsInput
) {
  return await careerPathRecommendations(input);
}

export async function fetchJobMarketTrends(input: JobMarketTrendsInput) {
  return await getJobMarketTrends(input);
}

export async function runSkillsGapAnalysis(input: SkillsGapAnalysisInput) {
  return await analyzeSkillsGap(input);
}

export async function fetchSkillsRecommendation(
  input: SkillsRecommendationInput
) {
  return await getSkillsRecommendation(input);
}

export async function fetchInterviewPrep(input: InterviewPrepInput) {
  return await getInterviewPrep(input);
}
