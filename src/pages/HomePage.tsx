import { Link } from 'react-router-dom'
import { ArrowRight, Users, BookOpen, MessageSquare, Star } from 'lucide-react'
import SpotlightCard from '../components/SpotlightCard'
import ClickSpark from '../components/ClickSpark'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section: full viewport height, centered, with navbar offset */}
      <div className="relative flex flex-col justify-center items-center min-h-screen" style={{paddingTop: '6rem'}}>
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-white tracking-wider text-center">
          CONDuit
        </h1>
        <div className="mt-8 w-full flex flex-col items-center justify-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2F3F5] mb-4 sm:mb-6 text-center">
            Connect, Learn, and
            <span className="text-[#7289da] block"> Exchange Skills</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#949BA4] mb-6 sm:mb-8 max-w-xl text-center">
            Join a community of learners and teachers. Share your expertise, learn from others, 
            and build meaningful connections through skill exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs mx-auto">
            <ClickSpark sparkColor="#7289da">
              <Link 
                to="/register" 
                className="btn-primary text-xs sm:text-sm px-3 py-2 min-w-[100px] inline-flex items-center justify-center touch-manipulation discord-hover"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </ClickSpark>
            <ClickSpark sparkColor="#7289da">
              <Link 
                to="/login" 
                className="btn-secondary text-xs sm:text-sm px-3 py-2 min-w-[100px] inline-flex items-center justify-center touch-manipulation discord-hover"
              >
                Sign In
              </Link>
            </ClickSpark>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-[#313338] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F3F5] mb-3 sm:mb-4">
              Why Choose CONDuit?
            </h2>
            <p className="text-lg sm:text-xl text-[#949BA4]">
              A platform designed for meaningful skill exchanges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <SpotlightCard>
              <div className="text-center">
                <ClickSpark sparkColor="#7289da">
                  <div className="bg-[#7289da] w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </ClickSpark>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F2F3F5] mb-2 sm:mb-3">
                  Connect with Peers
                </h3>
                <p className="text-[#949BA4] text-sm sm:text-base">
                  Find like-minded individuals who share your interests and learning goals.
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="text-center">
                <ClickSpark sparkColor="#57F287">
                  <div className="bg-[#57F287] w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-[#313338]" />
                  </div>
                </ClickSpark>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F2F3F5] mb-2 sm:mb-3">
                  Learn New Skills
                </h3>
                <p className="text-[#949BA4] text-sm sm:text-base">
                  Discover a wide range of skills from technology to arts, languages to cooking.
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="text-center">
                <ClickSpark sparkColor="#FAA61A">
                  <div className="bg-[#FAA61A] w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-[#313338]" />
                  </div>
                </ClickSpark>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F2F3F5] mb-2 sm:mb-3">
                  Exchange Knowledge
                </h3>
                <p className="text-[#949BA4] text-sm sm:text-base">
                  Share your expertise and receive valuable knowledge in return.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-[#2B2D31] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">1,000+</div>
              <div className="text-[#E8F2FF] text-sm sm:text-base">Active Users</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">500+</div>
              <div className="text-[#E8F2FF] text-sm sm:text-base">Skills Available</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">2,500+</div>
              <div className="text-[#E8F2FF] text-sm sm:text-base">Successful Swaps</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">4.8</div>
              <div className="text-[#E8F2FF] flex items-center justify-center text-sm sm:text-base">
                <Star className="h-4 w-4 mr-1" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-[#313338] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F3F5] mb-3 sm:mb-4">
            Ready to Start Your Skill Exchange Journey?
          </h2>
          <p className="text-lg sm:text-xl text-[#949BA4] mb-6 sm:mb-8">
            Join thousands of learners and teachers on CONDuit today.
          </p>
          <ClickSpark sparkColor="#7289da">
            <Link 
              to="/register" 
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 inline-flex items-center justify-center touch-manipulation discord-hover"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </ClickSpark>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1E1F22] text-white py-8 sm:py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[#7289da] mb-3 sm:mb-4">CONDuit</h3>
            <p className="text-[#949BA4] mb-4 sm:mb-6 text-sm sm:text-base">
              Connecting people through skill exchange
            </p>
            <div className="text-xs sm:text-sm text-[#6D6F78]">
              © 2024 CONDuit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage 