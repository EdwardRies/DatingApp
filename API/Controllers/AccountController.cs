using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Text;
using API.DTO;
using System.Security.Cryptography;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, 
            ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            using var hmac = new HMACSHA512();

            var user = new AppUser() 
            {
                UserName = registerDto.Username, 
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)), 
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            
            await _context.SaveChangesAsync();

            return Ok(new UserDto() { Username = user.UserName, Token = _tokenService.CreateToken(user) });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(o => o.UserName == loginDto.Username);
            
            if (user == null) return Unauthorized("Invalid Login");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (user.PasswordHash[i] != computedHash[i]) return Unauthorized("Invalid Login");
            }

            return Ok(new UserDto() { Username = user.UserName, Token = _tokenService.CreateToken(user) });
        }

        private async Task<bool> UserExists(string username) => 
            await _context.Users.AnyAsync(u => u.UserName == username.ToLower());

    }
}
