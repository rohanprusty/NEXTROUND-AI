import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import toast from 'react-hot-toast';

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      }, { withCredentials: true });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewForge.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifypay = await axios.post(ServerUrl + "/api/payment/verify", response, { withCredentials: true });
          dispatch(setUserData(verifypay.data.user));

          toast.success("Credits added successfully!");
          navigate("/");
        },
        theme: {
          color: "#A78BFA",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      toast.error("Payment failed. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className='min-h-screen bg-bg-primary py-16 px-6 relative overflow-hidden'>
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-accent-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className='max-w-6xl mx-auto mb-16 relative z-10'>
        <button 
          onClick={() => navigate(-1)} 
          className='absolute left-0 top-2 p-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors'
        >
          <ArrowLeft size={20} className='text-gray-300' />
        </button>

        <div className="text-center w-full pt-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Flexible pricing to match your interview preparation goals. Unlock the full potential of AI.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isPro = plan.id === 'pro';

          return (
            <motion.div 
              key={plan.id}
              whileHover={!plan.default && { scale: 1.02 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col
                ${isSelected && !plan.default
                  ? "border-accent-secondary/60 bg-white/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] glow-border"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
                }
                ${plan.default ? "cursor-default opacity-80" : "cursor-pointer"}
                ${isPro ? "lg:-mt-4 lg:mb-4" : ""}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.5)] flex items-center gap-1 border border-white/20">
                  <Sparkles size={12} />
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-white/10 text-gray-400 text-xs px-3 py-1 rounded-full border border-white/5">
                  Default
                </div>
              )}

              <h3 className="text-xl font-semibold text-white mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <p className="text-accent-primary font-medium mt-2">
                  {plan.credits} Credits
                </p>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed pb-6 border-b border-white/10 mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <div className="space-y-4 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent-secondary shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan);
                    }
                  }} 
                  className={`w-full mt-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                    isSelected
                    ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
