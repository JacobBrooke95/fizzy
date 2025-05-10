class CommandsController < ApplicationController
  def index
    @commands = Current.user.commands.order(created_at: :desc).limit(20).reverse
  end

  def create
    command = parse_command(params[:command])

    if command.valid?
      if confirmed?(command)
        command.save!
        result = command.execute
        respond_with_execution_result(result)
      else
        render plain: command.title, status: :conflict
      end
    else
      head :unprocessable_entity
    end
  end

  private
    def parse_command(string)
      Command::Parser.new(parsing_context).parse(string)
    end

    def parsing_context
      Command::Parser::Context.new(Current.user, url: request.referrer)
    end

    def confirmed?(command)
      !command.needs_confirmation? || params[:confirmed].present?
    end

    def respond_with_execution_result(result)
      case result
      when Command::Result::Redirection
        redirect_to result.url
      when Command::Result::ChatResponse
        render turbo_stream: turbo_stream.append("chat-responses", partial: "commands/chat/response", locals: { content: result.content })
      else
        redirect_back_or_to root_path
      end
    end
end
