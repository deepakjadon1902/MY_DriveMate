import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, CreditCard, Car, Search } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/20 dark:from-primary/20 dark:to-accent/10 -z-10" />
        
        <motion.div
          className="container mx-auto px-4 md:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Share Rides,<br />
                <span className="text-primary">Save Money</span>,<br />
                Reduce Traffic
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground md:text-xl max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Connect with travelers going your way and share the journey. Affordable, eco-friendly, and socially rewarding!
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="glass-card p-6 rounded-2xl shadow-glass overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7706458/pexels-photo-7706458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="People in a car sharing a ride" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-lg shadow-glass">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Delhi → Mumbai</p>
                    <p className="text-sm text-muted-foreground">Today, 4 seats available</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-12 -right-6 glass-card p-4 rounded-lg shadow-glass">
                <div className="flex items-center space-x-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">₹1,200 per seat</p>
                    <p className="text-sm text-muted-foreground">Save up to 60%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* How It Works */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How My Drivemate Works</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Simple steps to start sharing rides and saving money
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="h-10 w-10" />,
                title: "Register as a Driver or Passenger",
                description: "Create your account and choose your role based on whether you want to offer rides or find them."
              },
              {
                icon: <MapPin className="h-10 w-10" />,
                title: "Offer or Find Rides",
                description: "Drivers can offer rides by providing details like route, time, and price. Passengers can search and book available rides."
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Connect and Travel Together",
                description: "Once a booking is confirmed, contact details are shared so you can coordinate the journey details."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="glass-card p-8 rounded-xl shadow-glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              
            </motion.div>
            
            <div className="space-y-8">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold">Everything You Need for Seamless Ride Sharing</h2>
                <p className="text-lg text-muted-foreground">
                  My Drivemate provides a complete platform with all the essential features to make your ride sharing experience smooth and enjoyable.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: <MapPin className="h-6 w-6 text-primary" />,
                    title: "Detailed Routes",
                    description: "Specify pickup and drop-off locations with precision"
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-primary" />,
                    title: "Flexible Scheduling",
                    description: "Choose ride times that fit your schedule"
                  },
                  {
                    icon: <CreditCard className="h-6 w-6 text-primary" />,
                    title: "Fair Pricing",
                    description: "Set your own prices as a driver, find affordable rides as a passenger"
                  },
                  {
                    icon: <Search className="h-6 w-6 text-primary" />,
                    title: "Easy Search",
                    description: "Find rides based on destination and date with our powerful search"
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="bg-primary/10 p-2 rounded-full h-fit">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Real experiences from people who use My Drivemate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I've been saving almost ₹5,000 per month on my daily commute since I started using My Drivemate to share rides!",
                name: "Rahul Sharma",
                role: "Software Engineer",
                avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
              },
              {
                quote: "As a driver, I've made new friends and covered my fuel costs. The app is super easy to use and the notification system works flawlessly.",
                name: "Priya Patel",
                role: "Marketing Manager",
                avatar: "https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=100"
              },
              {
                quote: "The booking process is seamless and I love that I can see my ride history. My Drivemate is now my go-to for all intercity travel.",
                name: "Amit Kumar",
                role: "College Student",
                avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=100"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="glass-card p-8 rounded-xl shadow-glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <p className="text-foreground italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="glass-card p-8 md:p-12 rounded-2xl shadow-glass relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/20 dark:from-primary/20 dark:to-accent/10 -z-10" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Sharing Rides?</h2>
                <p className="text-lg">
                  Join My Drivemate today and experience a smarter, more affordable way to travel.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="btn-primary">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <motion.div 
                  className="inline-block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Car className="h-32 w-32 mx-auto lg:ml-auto lg:mr-0 text-primary" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;