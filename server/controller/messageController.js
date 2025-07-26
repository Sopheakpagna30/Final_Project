import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'username email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { name, description, participants } = req.body;

    const conversation = new Conversation({
      name,
      description,
      participants: [req.user._id, ...participants],
      admin: req.user._id
    });

    await conversation.save();
    await conversation.populate('participants', 'username email');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .populate('sender', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType } = req.body;

    const message = new Message({
      sender: req.user._id,
      content,
      conversationId,
      messageType: messageType || 'text'
    });

    await message.save();
    await message.populate('sender', 'username email');

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// New function for deleting a conversation and its messages
export const deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Only allow participants to delete conversation
    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to delete this conversation' });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId: id });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(id);

    res.json({ message: 'Conversation and its messages deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};