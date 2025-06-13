import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import Section from './common/Section';

const team = [
  {
    name: "Jonathan Insell",
    role: "CEO & Founder", 
    image: "/Yoni.jpg",
    gradient: "from-blue-500 to-indigo-500",
    social: {
      linkedin: "https://www.linkedin.com/in/jonathan-charles-insell/",
      instagram: "https://www.instagram.com/twostepsai/"
    }
  },
  {
    name: "Shay Bushary",
    role: "Head Developer",
    image: "/Shay.jpeg",
    gradient: "from-purple-500 to-pink-500",
    social: {
      linkedin: "https://www.linkedin.com/in/shaybushary/",
      instagram: "https://www.instagram.com/twostepsai/"
    }
  },
  {
    name: "Ziv Edri",
    role: "CFO",
    image: "/Ziv.jpeg",
    gradient: "from-amber-500 to-orange-500",
    social: {
      linkedin: "https://www.linkedin.com/in/ziv-edri/",
      instagram: "https://www.instagram.com/twostepsai/"
    }
  },
  {
    name: "Tal Sumroy",
    role: "Head of Marketing",
    image: "/Tal.jpeg",
    gradient: "from-green-500 to-emerald-500",
    social: {
      linkedin: "https://www.linkedin.com/in/tal-sumroy/",
      instagram: "https://www.instagram.com/twostepsai/"
    }
  }
];

const TeamMemberCard = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="group relative"
  >
    <div className="relative">
      {/* Main Card */}
      <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
        {/* Image Container */}
        <div className="relative h-[350px] overflow-hidden">
          {/* Image */}
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-700 
              group-hover:scale-110 
              filter 
              brightness-90 
              group-hover:brightness-100 
              group-hover:contrast-125"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-6 -mt-16">
          <motion.h3
            className="text-2xl font-bold text-white mb-2 mt-4"
          >
            {member.name}
          </motion.h3>
          <motion.p
            className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} font-medium mb-4`}
          >
            {member.role}
          </motion.p>

          {/* Social Links */}
          <div className="flex space-x-3">
            <motion.a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 hover:bg-opacity-75 transition-all duration-300`}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </motion.a>
            <motion.a
              href={member.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 hover:bg-opacity-75 transition-all duration-300`}
              aria-label="Instagram Profile"
            >
              <Instagram className="w-5 h-5 text-white" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${member.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl -z-10`} />
    </div>
  </motion.div>
);

const Team = () => {
  return (
    <Section id="team">
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />

        {/* Content */}
        <div className="relative">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
            >
              THE TEAM
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                We Are Ready To Provide Solutions
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Team;