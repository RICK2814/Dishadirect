"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  Loader2,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import type { CareerPathRecommendationsOutput } from "@/ai/flows/career-path-recommendations";
import type { JobMarketTrendsOutput } from "@/ai/flows/job-market-trends";
import type { SkillsGapAnalysisOutput } from "@/ai/flows/skills-gap-analysis";
import type { SkillsRecommendationOutput } from "@/ai/flows/skills-recommendation";
import type { InterviewPrepOutput } from "@/ai/flows/interview-prep";
import {
  getCareerPathRecommendations,
  fetchJobMarketTrends,
  runSkillsGapAnalysis,
  fetchSkillsRecommendation,
  fetchInterviewPrep,
} from "@/app/actions";
import { Logo } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";


const profileSchema = z.object({
  skills: z.string().min(10, "Please describe your skills in more detail."),
  interests: z.string().min(10, "Please describe your interests in more detail."),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function DishaDirectApp() {
  const { toast } = useToast();
  const [careerPathsResult, setCareerPathsResult] = useState<CareerPathRecommendationsOutput | null>(null);
  const [marketTrendsResult, setMarketTrendsResult] = useState<JobMarketTrendsOutput | null>(null);
  const [skillsGapResult, setSkillsGapResult] = useState<SkillsGapAnalysisOutput | null>(null);
  const [skillRecsResult, setSkillRecsResult] = useState<SkillsRecommendationOutput | null>(null);
  const [interviewPrepResult, setInterviewPrepResult] = useState<InterviewPrepOutput | null>(null);

  const [userProfile, setUserProfile] = useState<ProfileFormValues | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [activeTab, setActiveTab] = useState("career-paths");

  const [isLoading, setIsLoading] = useState(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const skillsTabRef = useRef<HTMLDivElement>(null);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { skills: "", interests: "" },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);
    setCareerPathsResult(null);
    setMarketTrendsResult(null);
    setSkillsGapResult(null);
    setSkillRecsResult(null);
    setInterviewPrepResult(null);
    setSelectedCareer('');
    setUserProfile(data);
    setActiveTab("career-paths");

    try {
      const [careerPaths, marketTrends] = await Promise.all([
        getCareerPathRecommendations({ skills: data.skills, interests: data.interests }),
        fetchJobMarketTrends({ userSkills: data.skills, userInterests: data.interests }),
      ]);
      setCareerPathsResult(careerPaths);
      setMarketTrendsResult(marketTrends);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch AI-powered insights. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCareerSelection = async (career: string) => {
    setSelectedCareer(career);
    setActiveTab("skills-dev");
    if (!userProfile || !career) return;
    
    // Scroll to the skills development tab content for better UX
    setTimeout(() => skillsTabRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    setIsSkillsLoading(true);
    setSkillsGapResult(null);
    setSkillRecsResult(null);
    setInterviewPrepResult(null);
    try {
      const [skillsGap, interviewPrep] = await Promise.all([
        runSkillsGapAnalysis({ currentSkills: userProfile.skills, desiredCareerPath: career }),
        fetchInterviewPrep({ careerPath: career, userSkills: userProfile.skills }),
      ]);
      
      setSkillsGapResult(skillsGap);
      setInterviewPrepResult(interviewPrep);
      
      if (skillsGap.missingSkills) {
        const recommendations = await fetchSkillsRecommendation({ careerPath: career, skillsGap: skillsGap.missingSkills });
        setSkillRecsResult(recommendations);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch skills development plan. Please try again.",
      });
    } finally {
      setIsSkillsLoading(false);
    }
  };

  const welcomeImage = PlaceHolderImages.find(img => img.id === 'career-guidance');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center gap-3 px-4 md:px-6">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">
            DishaDirect
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 xl:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Sparkles className="text-accent" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  Tell us about yourself to get personalized career advice.
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Skills</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Python, public speaking, video editing..."
                              className="resize-none"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Interests</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., technology, creative writing, renewable energy..."
                              className="resize-none"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : "Get Career Insights"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </aside>

          <section className="lg:col-span-2 xl:col-span-3">
            <AnimatePresence mode="wait">
              {!userProfile ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
                    {welcomeImage && (
                        <Image
                          src={welcomeImage.imageUrl}
                          alt={welcomeImage.description}
                          width={400}
                          height={300}
                          className="mb-6 rounded-lg"
                          data-ai-hint={welcomeImage.imageHint}
                        />
                    )}
                    <h2 className="font-headline text-2xl font-bold">Welcome to DishaDirect</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Fill out your profile to unlock AI-powered career recommendations and navigate your path to success.
                    </p>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="career-paths"><Briefcase className="mr-2 h-4 w-4"/>Career Paths</TabsTrigger>
                      <TabsTrigger value="market-trends"><TrendingUp className="mr-2 h-4 w-4"/>Market Trends</TabsTrigger>
                      <TabsTrigger value="skills-dev"><Target className="mr-2 h-4 w-4"/>Skills Development</TabsTrigger>
                    </TabsList>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="career-paths" className="mt-6">
                          {isLoading ? (
                            <div className="space-y-4">
                              <Skeleton className="h-32 w-full" />
                              <Skeleton className="h-24 w-full" />
                            </div>
                          ) : careerPathsResult ? (
                            <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
                              <motion.div variants={itemVariants}>
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="font-headline flex items-center gap-2"><Lightbulb className="text-accent"/>AI-Powered Reasoning</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-muted-foreground">{careerPathsResult.reasoning}</p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                              <motion.div variants={itemVariants}>
                                <h3 className="text-xl font-headline font-semibold mb-4 flex items-center gap-2"><ClipboardList className="text-primary"/>Recommended Career Paths</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  {careerPathsResult.careerPaths.map((path, i) => (
                                    <button key={i} onClick={() => handleCareerSelection(path)} className="w-full text-left">
                                      <Card className="hover:shadow-md hover:border-primary transition-all h-full">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-base font-medium font-headline">{path}</CardTitle>
                                          <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                                        </CardHeader>
                                      </Card>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            </motion.div>
                          ) : null}
                        </TabsContent>

                        <TabsContent value="market-trends" className="mt-6">
                          {isLoading ? (
                            <div className="grid md:grid-cols-2 gap-4">
                              <Skeleton className="h-48 w-full" />
                              <Skeleton className="h-48 w-full" />
                            </div>
                          ) : marketTrendsResult ? (
                            <motion.div className="grid gap-6 md:grid-cols-2" variants={containerVariants} initial="hidden" animate="visible">
                              <motion.div variants={itemVariants}>
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="font-headline">Job Market Trends</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-muted-foreground">{marketTrendsResult.trends}</p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                              <motion.div variants={itemVariants}>
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="font-headline">In-Demand Skills</CardTitle>
                                  </CardHeader>
                                  <CardContent className="flex flex-wrap gap-2">
                                    {marketTrendsResult.inDemandSkills.split(',').map((skill, i) => (
                                      <Badge key={i} variant="secondary">{skill.trim()}</Badge>
                                    ))}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </motion.div>
                          ) : null}
                        </TabsContent>

                        <TabsContent value="skills-dev" className="mt-6 space-y-6" ref={skillsTabRef}>
                          <Card>
                            <CardHeader>
                              <CardTitle className="font-headline">Select a Career Path to Analyze</CardTitle>
                              <CardDescription>Choose one of the recommended careers to see a detailed skills analysis.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Select onValueChange={handleCareerSelection} value={selectedCareer} disabled={!careerPathsResult}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a career path..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {careerPathsResult?.careerPaths.map((path, i) => (
                                    <SelectItem key={i} value={path}>{path}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </CardContent>
                          </Card>

                          {!selectedCareer && !isSkillsLoading && (
                             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
                                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                <h2 className="font-headline text-xl font-bold">Plan Your Growth</h2>
                                <p className="text-muted-foreground mt-2 max-w-md">
                                  Select a career path above to get a personalized skills development and interview preparation plan.
                                </p>
                              </Card>
                            </motion.div>
                          )}

                          {isSkillsLoading ? (
                            <div className="space-y-4">
                              <Skeleton className="h-24 w-full" />
                              <Skeleton className="h-40 w-full" />
                              <Skeleton className="h-40 w-full" />
                            </div>
                          ) : (
                            <AnimatePresence>
                              {skillsGapResult && (
                                <motion.div key="skills-gap" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="font-headline">Your Skills Gap</CardTitle>
                                      <CardDescription>These are the skills you need to develop for a career in <span className="font-bold text-primary">{selectedCareer}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                      {skillsGapResult.missingSkills.split(',').map((skill, i) => (
                                        <Badge key={i} variant="destructive">{skill.trim()}</Badge>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )}
                              
                              {skillRecsResult && (
                                <motion.div key="learning-roadmap" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="text-accent"/>Your Learning Roadmap</CardTitle>
                                      <CardDescription>Curated resources and learning paths to bridge your skills gap.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <Accordion type="multiple" className="w-full">
                                        {skillRecsResult.learningPaths.length > 0 && (
                                          <AccordionItem value="learning-paths">
                                            <AccordionTrigger className="text-lg font-semibold">Learning Paths</AccordionTrigger>
                                            <AccordionContent>
                                              <div className="space-y-4 mt-2">
                                              {skillRecsResult.learningPaths.map((path, i) => (
                                                <div key={i} className="p-4 border rounded-lg">
                                                  <h4 className="font-semibold">{path.title}</h4>
                                                  <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                                                  <ul className="space-y-1 list-disc list-inside">
                                                    {path.steps.map((step, j) => <li key={j} className="text-sm">{step}</li>)}
                                                  </ul>
                                                </div>
                                              ))}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        )}
                                        {skillRecsResult.resources.length > 0 && (
                                          <AccordionItem value="resources">
                                            <AccordionTrigger className="text-lg font-semibold">Curated Resources</AccordionTrigger>
                                            <AccordionContent>
                                              <div className="space-y-2 mt-2">
                                                {skillRecsResult.resources.map((res, i) => (
                                                  <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg hover:bg-muted/50">
                                                      <div className="flex justify-between items-center">
                                                        <div>
                                                          <p className="font-semibold">{res.title}</p>
                                                          <p className="text-sm text-muted-foreground">{res.description}</p>
                                                        </div>
                                                        <Badge variant="outline" className="capitalize">{res.type}</Badge>
                                                      </div>
                                                  </a>
                                                ))}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        )}
                                      </Accordion>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )}

                              {interviewPrepResult && (
                                <motion.div key="interview-prep" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="font-headline flex items-center gap-2"><Mic className="text-accent"/>Interview Prep</CardTitle>
                                      <CardDescription>Practice questions and tips for your <span className="font-bold text-primary">{selectedCareer}</span> interview.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <Accordion type="multiple" className="w-full">
                                        <AccordionItem value="questions">
                                          <AccordionTrigger className="text-lg font-semibold">Sample Questions</AccordionTrigger>
                                          <AccordionContent>
                                            <div className="space-y-4 mt-2">
                                              {interviewPrepResult.sampleQuestions.map((item, i) => (
                                                <div key={i} className="p-4 border rounded-lg">
                                                  <p className="font-semibold">{i+1}. {item.question}</p>
                                                  <p className="text-sm text-muted-foreground mt-2">{item.answer_guideline}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="tips">
                                          <AccordionTrigger className="text-lg font-semibold">Preparation Tips</AccordionTrigger>
                                          <AccordionContent>
                                            <ul className="space-y-2 list-disc list-inside mt-2">
                                              {interviewPrepResult.preparationTips.map((tip, i) => <li key={i} className="text-sm">{tip}</li>)}
                                            </ul>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
