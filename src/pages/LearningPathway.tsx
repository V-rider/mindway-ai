import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { LearningPathway as LearningPathwayComponent } from "@/components/ui/LearningPath";
import { LearningPath } from "@/types";
import { useSearchParams } from "react-router-dom";

const LearningPathway = () => {
  const [searchParams] = useSearchParams();
  const selectedConcept = searchParams.get("concept") || undefined;
  
  // Mock data for learning paths
  const mockLearningPaths: LearningPath[] = [
    {
      strand: "Number",
      topics: [
        {
          id: "number-operations",
          name: "Number Operations",
          description: "Learn to perform arithmetic operations with whole numbers.",
          objectives: [
            "Recognize and use the commutative and associative properties of addition and multiplication",
            "Perform four arithmetic operations of whole numbers and check the reasonableness of results",
            "Use numbers to formulate and solve simple problems"
          ],
          progress: 85,
          exercises: [
            {
              id: "ex-1",
              title: "Basic Operations Practice",
              difficulty: "easy",
              questions: 10,
              completed: true
            },
            {
              id: "ex-2",
              title: "Word Problems with Operations",
              difficulty: "medium",
              questions: 8,
              completed: true
            },
            {
              id: "ex-3",
              title: "Mixed Operations Challenge",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        },
        {
          id: "fractions",
          name: "Fractions",
          description: "Understanding and working with fractions.",
          objectives: [
            "Recognize the concepts of fractions",
            "Compare and order fractions",
            "Perform operations with fractions",
            "Solve problems involving fractions"
          ],
          progress: 62,
          exercises: [
            {
              id: "ex-4",
              title: "Introduction to Fractions",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-5",
              title: "Comparing Fractions",
              difficulty: "medium",
              questions: 6,
              completed: true
            },
            {
              id: "ex-6",
              title: "Fraction Operations",
              difficulty: "medium",
              questions: 10,
              completed: false
            },
            {
              id: "ex-7",
              title: "Word Problems with Fractions",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        },
        {
          id: "decimals",
          name: "Decimals",
          description: "Understanding and working with decimal numbers.",
          objectives: [
            "Recognize the concepts of decimals",
            "Compare and order decimals",
            "Perform operations with decimals",
            "Solve problems involving decimals"
          ],
          progress: 75,
          exercises: [
            {
              id: "ex-8",
              title: "Introduction to Decimals",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-9",
              title: "Decimal Operations",
              difficulty: "medium",
              questions: 12,
              completed: true
            },
            {
              id: "ex-10",
              title: "Word Problems with Decimals",
              difficulty: "hard",
              questions: 6,
              completed: false
            }
          ]
        }
      ]
    },
    {
      strand: "Measures",
      topics: [
        {
          id: "length-weight-capacity",
          name: "Length, Weight and Capacity",
          description: "Learn about measurement units and how to use them.",
          objectives: [
            "Recognize the concepts of length, distance, weight and capacity",
            "Use different ways to compare length, weight, capacity of objects",
            "Understand the need for using standard units of measurements",
            "Choose and use appropriate measuring tools and standard units"
          ],
          progress: 80,
          exercises: [
            {
              id: "ex-11",
              title: "Units of Measurement",
              difficulty: "easy",
              questions: 10,
              completed: true
            },
            {
              id: "ex-12",
              title: "Converting Between Units",
              difficulty: "medium",
              questions: 8,
              completed: true
            },
            {
              id: "ex-13",
              title: "Measurement Word Problems",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        },
        {
          id: "area-perimeter",
          name: "Area and Perimeter",
          description: "Learn to calculate the area and perimeter of shapes.",
          objectives: [
            "Recognize the concepts of perimeter and area",
            "Use different ways to compare the perimeter and area of 2-D shapes",
            "Choose appropriate standard units to measure and compare",
            "Use formulas to calculate perimeter and area"
          ],
          progress: 70,
          exercises: [
            {
              id: "ex-14",
              title: "Perimeter Basics",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-15",
              title: "Area of Rectangles",
              difficulty: "easy",
              questions: 6,
              completed: true
            },
            {
              id: "ex-16",
              title: "Area of Complex Shapes",
              difficulty: "medium",
              questions: 8,
              completed: false
            },
            {
              id: "ex-17",
              title: "Word Problems with Area/Perimeter",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        }
      ]
    },
    {
      strand: "Shape and Space",
      topics: [
        {
          id: "2d-3d-shapes",
          name: "2D and 3D Shapes",
          description: "Learn about different shapes and their properties.",
          objectives: [
            "Identify and describe 2-D and 3-D shapes",
            "Recognize the properties of shapes",
            "Recognize the inclusion relations between shapes",
            "Make 2-D shapes and appreciate the beauty of geometric shapes"
          ],
          progress: 75,
          exercises: [
            {
              id: "ex-18",
              title: "Identifying Shapes",
              difficulty: "easy",
              questions: 10,
              completed: true
            },
            {
              id: "ex-19",
              title: "Properties of 2D Shapes",
              difficulty: "medium",
              questions: 8,
              completed: true
            },
            {
              id: "ex-20",
              title: "Properties of 3D Shapes",
              difficulty: "medium",
              questions: 6,
              completed: false
            }
          ]
        },
        {
          id: "angles",
          name: "Angles",
          description: "Learn about different types of angles and their measurements.",
          objectives: [
            "Recognize the concepts of right angles, acute angles and obtuse angles",
            "Recognize the concepts of perpendicular and parallel",
            "Use the measuring tool to measure, compare and draw angles of different sizes"
          ],
          progress: 60,
          exercises: [
            {
              id: "ex-21",
              title: "Types of Angles",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-22",
              title: "Measuring Angles",
              difficulty: "medium",
              questions: 10,
              completed: false
            },
            {
              id: "ex-23",
              title: "Angles in Shapes",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        }
      ]
    },
    {
      strand: "Data Handling",
      topics: [
        {
          id: "data-representation",
          name: "Data Representation",
          description: "Learn to collect, organize, and represent data.",
          objectives: [
            "Recognize the importance of the organization and representation of statistical data",
            "Collect and group statistical data according to given criteria",
            "Use appropriate scales to construct simple statistical charts and interpret them"
          ],
          progress: 65,
          exercises: [
            {
              id: "ex-24",
              title: "Data Collection",
              difficulty: "easy",
              questions: 6,
              completed: true
            },
            {
              id: "ex-25",
              title: "Creating Bar Charts",
              difficulty: "medium",
              questions: 8,
              completed: false
            },
            {
              id: "ex-26",
              title: "Interpreting Data",
              difficulty: "medium",
              questions: 10,
              completed: false
            }
          ]
        },
        {
          id: "statistics",
          name: "Statistics",
          description: "Learn basic statistics concepts and calculations.",
          objectives: [
            "Understand the criteria for organizing and representing statistical data",
            "Use approximate values and appropriate scales to construct statistical charts",
            "Recognize the concept of average and solve problems",
            "Formulate and solve problems arising from statistical data"
          ],
          progress: 50,
          exercises: [
            {
              id: "ex-27",
              title: "Finding Averages",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-28",
              title: "Analyzing Data Sets",
              difficulty: "medium",
              questions: 10,
              completed: false
            },
            {
              id: "ex-29",
              title: "Statistical Problems",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        }
      ]
    },
    {
      strand: "Algebra",
      topics: [
        {
          id: "algebraic-expressions",
          name: "Algebraic Expressions",
          description: "Learn to use symbols and create algebraic expressions.",
          objectives: [
            "Use symbols to represent numbers",
            "Use algebraic expressions to represent the operations and relations between quantities",
            "Recognize how to check the reasonableness of results"
          ],
          progress: 40,
          exercises: [
            {
              id: "ex-30",
              title: "Introduction to Variables",
              difficulty: "easy",
              questions: 8,
              completed: true
            },
            {
              id: "ex-31",
              title: "Creating Expressions",
              difficulty: "medium",
              questions: 10,
              completed: false
            },
            {
              id: "ex-32",
              title: "Evaluating Expressions",
              difficulty: "medium",
              questions: 8,
              completed: false
            }
          ]
        },
        {
          id: "simple-equations",
          name: "Simple Equations",
          description: "Learn to solve basic equations with one unknown.",
          objectives: [
            "Use algebra to formulate and solve simple problems",
            "Understand equations with one unknown quantity",
            "Solve simple linear equations"
          ],
          progress: 35,
          exercises: [
            {
              id: "ex-33",
              title: "One-Step Equations",
              difficulty: "easy",
              questions: 10,
              completed: true
            },
            {
              id: "ex-34",
              title: "Two-Step Equations",
              difficulty: "medium",
              questions: 8,
              completed: false
            },
            {
              id: "ex-35",
              title: "Word Problems with Equations",
              difficulty: "hard",
              questions: 5,
              completed: false
            }
          ]
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Learning Pathway
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Follow your personalized learning journey to master math concepts.
            {selectedConcept && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Focus: {selectedConcept}
              </span>
            )}
          </p>
        </div>
        
        {/* Learning Pathway Component */}
        <LearningPathwayComponent 
          learningPaths={mockLearningPaths}
          selectedConcept={selectedConcept}
        />
      </div>
    </MainLayout>
  );
};

export default LearningPathway;
