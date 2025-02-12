class AddAutoPopAtToBubbles < ActiveRecord::Migration[8.1]
  def change
    change_table :bubbles do |t|
      t.datetime :auto_pop_at, index: true
    end
  end
end
