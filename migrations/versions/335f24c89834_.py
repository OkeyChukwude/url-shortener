"""empty message

Revision ID: 335f24c89834
Revises: c073447f5d35
Create Date: 2023-03-01 16:35:51.653330

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '335f24c89834'
down_revision = 'c073447f5d35'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index('ix_user_name')
        batch_op.create_index(batch_op.f('ix_user_name'), ['name'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_user_name'))
        batch_op.create_index('ix_user_name', ['name'], unique=False)

    # ### end Alembic commands ###
