import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <Link to="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all duration-300 transform hover:scale-105">
                  SkillVerse
                </span>
              </Link>
            </h3>
            <p className="text-gray-300">
              Empowering learners worldwide with quality education and practical
              skills.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-300 hover:text-white">
                  Courses
                </a>
              </li>
              <li>
                <a href="/instructors" className="text-gray-300 hover:text-white">
                  Instructors
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@learnify.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Education St, Learning City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} SkillVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 