
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  FileSearch,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Sample mock data for miscorrection results
const mockPapers = [
  {
    id: "paper-1",
    studentName: "Emma Johnson",
    testName: "Math Midterm",
    date: "2023-10-15",
    possibleMiscorrections: [
      {
        questionNumber: 3,
        studentAnswer: "x = 7",
        markedAs: "incorrect",
        suggestedCorrectness: "correct",
        confidence: 0.92,
        explanation: "The student's solution is mathematically accurate. They correctly solved for x in the equation 2x - 7 = 7."
      },
      {
        questionNumber: 8,
        studentAnswer: "16 square units",
        markedAs: "correct",
        suggestedCorrectness: "correct",
        confidence: 0.95,
        explanation: "The student's answer is correctly marked as correct. The area of the rectangle is indeed 16 square units."
      }
    ]
  },
  {
    id: "paper-2",
    studentName: "James Smith",
    testName: "Fractions Quiz",
    date: "2023-10-10",
    possibleMiscorrections: [
      {
        questionNumber: 5,
        studentAnswer: "3/8",
        markedAs: "incorrect",
        suggestedCorrectness: "correct",
        confidence: 0.87,
        explanation: "The student's answer of 3/8 is the correct simplified form of 6/16."
      }
    ]
  },
  {
    id: "paper-3",
    studentName: "Sofia Garcia",
    testName: "Geometry Test",
    date: "2023-09-25",
    possibleMiscorrections: [
      {
        questionNumber: 2,
        studentAnswer: "45 degrees",
        markedAs: "incorrect",
        suggestedCorrectness: "incorrect",
        confidence: 0.78,
        explanation: "The student's answer is correctly marked as incorrect. The angle measure should be 60 degrees."
      },
      {
        questionNumber: 7,
        studentAnswer: "Circle",
        markedAs: "incorrect",
        suggestedCorrectness: "correct",
        confidence: 0.89,
        explanation: "The student's answer is valid according to the problem statement which asked for any shape with rotational symmetry."
      }
    ]
  }
];

export const PaperMiscorrectionChecker: React.FC = () => {
  const [activePaper, setActivePaper] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("recent");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { toast } = useToast();
  
  // Find the active paper
  const paperDetails = mockPapers.find(paper => paper.id === activePaper);
  
  // Handle file upload
  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate upload and analysis process
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        toast({
          title: "Analysis Complete",
          description: "We've identified 2 potential miscorrections in the uploaded paper.",
          variant: "success"
        });
        setActivePaper("paper-1");
      }, 2000);
    }, 1500);
  };
  
  // Handle class selection
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };
  
  // Render file upload and selection UI
  const renderUploadSection = () => (
    <div className="space-y-6 my-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Student Papers</CardTitle>
          <CardDescription>
            Upload graded papers to check for potential miscorrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PDF, JPG, or PNG (MAX. 10MB)
            </p>
            <Button 
              onClick={handleFileUpload} 
              className="mt-4"
              disabled={isUploading || isAnalyzing}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4 mr-2" />
                  Check for Miscorrections
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Select from Existing Papers</CardTitle>
          <CardDescription>
            Review previously graded papers for potential miscorrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="class-select" className="block text-sm font-medium mb-2 dark:text-gray-400">
                Select Class
              </label>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-1">Class 3A</SelectItem>
                  <SelectItem value="class-2">Class 4B</SelectItem>
                  <SelectItem value="class-3">Class 5C</SelectItem>
                  <SelectItem value="class-4">Class 6A</SelectItem>
                  <SelectItem value="class-5">Class 6B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent Papers</TabsTrigger>
                <TabsTrigger value="flagged">Flagged Papers</TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="space-y-2 pt-2">
                  {mockPapers.map((paper) => (
                    <motion.div
                      key={paper.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        paper.id === activePaper
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setActivePaper(paper.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium">{paper.studentName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{paper.testName} • {paper.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 py-1 px-2 rounded">
                            {paper.possibleMiscorrections.length} potential {paper.possibleMiscorrections.length === 1 ? "issue" : "issues"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="flagged">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No flagged papers yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Render paper analysis results
  const renderPaperResults = () => (
    <div className="space-y-6 my-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{paperDetails?.studentName}</CardTitle>
            <CardDescription>
              {paperDetails?.testName} • {paperDetails?.date}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setActivePaper(null)}
          >
            Back to All Papers
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <h3 className="text-sm font-medium flex items-center text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                Potential Miscorrections Detected
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Our system has identified {paperDetails?.possibleMiscorrections.length} questions that may have been graded incorrectly.
              </p>
            </div>
            
            {paperDetails?.possibleMiscorrections.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {item.questionNumber}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.markedAs === "correct"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {item.markedAs === "correct" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Marked Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Marked Incorrect
                          </>
                        )}
                      </span>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.suggestedCorrectness === "correct"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {item.suggestedCorrectness === "correct" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Should Be Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Should Be Incorrect
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Student's answer:</p>
                      <p className="text-sm font-medium mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        {item.studentAnswer}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Analysis:</p>
                      <p className="text-sm mt-1">
                        {item.explanation}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence: {Math.round(item.confidence * 100)}%
                      </span>
                      <div className="grow h-2 ml-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-2 bg-purple-500 rounded-full" 
                          style={{ width: `${item.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Flag for Review</Button>
                  <div>
                    <Button variant="ghost" size="sm" className="mr-2">Reject</Button>
                    <Button size="sm">Accept Suggestion</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Mark as Reviewed</Button>
          <Button>Update Paper Grades</Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  return (
    <div>
      {activePaper ? renderPaperResults() : renderUploadSection()}
    </div>
  );
};
