class Command::ChatQuery < Command
  store_accessor :data, :query, :params

  def title
    "Chat query '#{query}'"
  end

  def execute
    response = chat.ask query
    Command::Result::ChatResponse.new(response.content)
  end

  private
    def chat
      chat = RubyLLM.chat
      chat.with_instructions prompt
    end

    def prompt
      <<~PROMPT
        You are a helpful assistant to translate natural language into commands that Fizzy understand, and to
        answer questions about the Fizzy system and the information it contains.

        Fizzy supports the following commands:

        - Assign users to cards: /assign user
        - Close cards: /close
        - Tag cards: /tag
        - Search cards: /search query

        You have to assume that the cards will be derived from the screen the user is at. But, if the user is
        querying for certain cards, you can use the /search command to search for them./

        The output must be simply a list of commands satisfying the user request, separated by newlines.
       PROMPT
    end
end
