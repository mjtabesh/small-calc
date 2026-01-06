import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Calculator, DollarSign, Heart, Ruler, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const calculatorCategories = [
  {
    title: "Finance Calculators",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    calculators: [
      {
        name: "Tax Calculator",
        description: "Calculate your 2025 Canadian income tax with detailed breakdown",
        page: "TaxCalculator",
        available: true
      },
      {
        name: "Mortgage Calculator",
        description: "Calculate monthly payments and amortization schedules",
        available: false
      },
      {
        name: "Investment Calculator",
        description: "Project your investment returns over time",
        available: false
      }
    ]
  },
  {
    title: "Health & Fitness",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    calculators: [
      {
        name: "BMI Calculator",
        description: "Calculate your Body Mass Index and health category",
        available: false
      },
      {
        name: "Calorie Calculator",
        description: "Estimate daily caloric needs based on your activity level",
        available: false
      }
    ]
  },
  {
    title: "Math & Conversion",
    icon: Ruler,
    color: "from-blue-500 to-indigo-600",
    calculators: [
      {
        name: "Unit Converter",
        description: "Convert between different units of measurement",
        available: false
      },
      {
        name: "Percentage Calculator",
        description: "Calculate percentages, increases, and decreases",
        available: false
      }
    ]
  },
  {
    title: "Date & Time",
    icon: Calendar,
    color: "from-violet-500 to-purple-600",
    calculators: [
      {
        name: "Age Calculator",
        description: "Calculate exact age from date of birth",
        available: false
      },
      {
        name: "Date Calculator",
        description: "Calculate date differences and add/subtract days",
        available: false
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Every Calculator You Need,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                All in One Place
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              From finance to fitness, math to dates – SmallCalc has you covered with 
              accurate, easy-to-use calculators for every need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-16">
          {calculatorCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.calculators.map((calc, calcIndex) => (
                  calc.available ? (
                    <Link
                      key={calcIndex}
                      to={createPageUrl(calc.page)}
                      className="group"
                    >
                      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all h-full">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {calc.name}
                          </h3>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {calc.description}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={calcIndex}
                      className="bg-slate-50 rounded-xl border border-slate-200 p-6 opacity-60 h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-600">
                          {calc.name}
                        </h3>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            More Calculators Coming Soon
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            We're constantly adding new calculators to help you with everyday calculations. 
            Check back regularly for updates!
          </p>
        </div>
      </section>
    </div>
  );
}