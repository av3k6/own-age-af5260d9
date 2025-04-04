
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContactAgentFormProps {
  propertyId: string;
}

const ContactAgentForm: React.FC<ContactAgentFormProps> = ({ propertyId }) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the listing agent",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input 
          placeholder="Your Name" 
          required 
        />
      </div>
      
      <div>
        <Input 
          type="email" 
          placeholder="Your Email" 
          required 
        />
      </div>
      
      <div>
        <Input 
          type="tel" 
          placeholder="Your Phone Number" 
        />
      </div>
      
      <div>
        <Textarea 
          placeholder="Your Message" 
          rows={4} 
          required 
        />
      </div>
      
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
};

export default ContactAgentForm;
