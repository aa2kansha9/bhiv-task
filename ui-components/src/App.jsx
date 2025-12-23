import React, { useState } from 'react';
import './index.css';
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';
import Modal from './components/Modal';
import ListRenderer from './components/ListRenderer';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const sampleItems = [
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
    { id: 3, name: 'Item 3', description: 'Third item' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            UI Component Library Preview
          </h1>
          <p className="text-gray-600">
            Day 1: Building reusable UI components with React & Tailwind CSS
          </p>
        </header>

        {/* Button Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Buttons</h2>
          <Card title="Button Variants">
            <div className="flex flex-wrap gap-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="success">Success Button</Button>
              <Button disabled>Disabled Button</Button>
              <Button size="sm">Small Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </Card>
        </section>

        {/* Input Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Input Fields</h2>
          <Card title="Form Inputs">
            <div className="space-y-4 max-w-md">
              <Input 
                label="Username" 
                placeholder="Enter username" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com" 
              />
              <Input 
                label="Disabled Input" 
                placeholder="This field is disabled" 
                disabled 
              />
            </div>
          </Card>
        </section>

        {/* Card Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Basic Card" subtitle="With a subtitle">
              <p className="text-gray-600 mb-3">
                This is a simple card component. Cards are useful for grouping related content.
              </p>
              <Button size="sm">Learn More</Button>
            </Card>
            
            <Card 
              title="Card with Footer" 
              footer={
                <div className="flex justify-between">
                  <Button variant="secondary" size="sm">Cancel</Button>
                  <Button size="sm">Confirm</Button>
                </div>
              }
            >
              <p className="text-gray-600">
                This card includes a footer section with action buttons.
              </p>
            </Card>
          </div>
        </section>

        {/* Modal Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Modal Dialog</h2>
          <Card title="Modal Example">
            <div className="space-y-4">
              <p className="text-gray-600">
                Click the button below to open a modal dialog.
              </p>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Contact Form"
                footer={
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      alert('Form submitted!');
                      setModalOpen(false);
                    }}>
                      Submit
                    </Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This is a modal dialog. It appears on top of other content.
                  </p>
                  <Input 
                    label="Full Name" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </Modal>
            </div>
          </Card>
        </section>

        {/* ListRenderer Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. List Renderer</h2>
          <Card title="Item List">
            <ListRenderer
              items={sampleItems}
              renderItem={(item) => (
                <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Button size="sm" variant="secondary">View</Button>
                </div>
              )}
            />
          </Card>
        </section>

        {/* Combined Example */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Combined Example</h2>
          <Card title="Registration Form">
            <form className="space-y-4">
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                required
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com" 
                required
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="Create a password"
                required
              />
              <div className="pt-4 flex gap-2">
                <Button type="submit">Create Account</Button>
                <Button type="button" variant="secondary">Cancel</Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-gray-500">
          <p>UI Component Library • Built with React & Tailwind CSS</p>
          <p className="text-sm mt-1">Day 1 of 7-Day Learning Task</p>
        </footer>
      </div>
    </div>
  );
}

export default App;